import csv, math
from collections import defaultdict

FILES = {k: rf"C:\Users\b0231\Downloads\{k}_15s.csv" for k in [
    'R_10','R_25','R_50','R_75','R_100','1HZ10V','1HZ25V','1HZ50V','1HZ75V','1HZ100V']}

def load(path):
    with open(path) as f:
        return [{'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
                 'c':float(r['close']),'t':int(r['time_unix'])} for r in csv.DictReader(f)]

def precompute(rows):
    n=len(rows); cl=[r['c'] for r in rows]; hi=[r['h'] for r in rows]; lo=[r['l'] for r in rows]
    sma20=[None]*n; sd20=[None]*n; rsi14=[None]*n; cci14=[None]*n; atr14=[None]*n
    ema12=[None]*n; ema26=[None]*n; macd_l=[None]*n; macd_s=[None]*n; macd_h=[None]*n
    for i in range(19,n):
        s=0
        for j in range(i-19,i+1): s+=cl[j]
        sma20[i]=s/20; m=sma20[i]; ss=0
        for j in range(i-19,i+1): d=cl[j]-m; ss+=d*d
        sd20[i]=math.sqrt(ss/20)
    for i in range(14,n):
        g=l=0
        for j in range(i-13,i+1):
            d=cl[j]-cl[j-1]
            if d>0: g+=d
            else: l-=d
        ag=g/14; al=l/14
        rsi14[i]=100 if al==0 else 100-100/(1+ag/al)
    for i in range(13,n):
        s=0
        for j in range(i-13,i+1): s+=(hi[j]+lo[j]+cl[j])/3
        m=s/14; md=0
        for j in range(i-13,i+1): md+=abs((hi[j]+lo[j]+cl[j])/3-m)
        md/=14; cci14[i]=0 if md==0 else ((hi[i]+lo[i]+cl[i])/3-m)/(0.015*md)
    for i in range(14,n):
        s=0
        for j in range(i-13,i+1):
            tr=hi[j]-lo[j]; a1=abs(hi[j]-cl[j-1]); a2=abs(lo[j]-cl[j-1])
            s+=(tr if tr>a1 else a1) if (tr if tr>a1 else a1)>a2 else a2
        atr14[i]=s/14
    def calc_ema(arr,period):
        ema=[None]*n; k=2/(period+1); s=0
        for j in range(period): s+=arr[j]
        ema[period-1]=s/period
        for i in range(period,n): ema[i]=arr[i]*k+ema[i-1]*(1-k)
        return ema
    ema12=calc_ema(cl,12); ema26=calc_ema(cl,26)
    for i in range(25,n):
        if ema12[i] is not None and ema26[i] is not None: macd_l[i]=ema12[i]-ema26[i]
    k_signal=2/10
    for i in range(25,n):
        if macd_l[i] is None: continue
        if i==25: macd_s[i]=macd_l[i]
        else: macd_s[i]=macd_l[i]*k_signal+macd_s[i-1]*(1-k_signal)
    for i in range(25,n):
        if macd_s[i] is not None: macd_h[i]=macd_l[i]-macd_s[i]
    return cl,hi,lo,sma20,sd20,rsi14,cci14,atr14,macd_l,macd_s,macd_h

results=defaultdict(lambda:defaultdict(lambda:[0,0]))

for sym,path in FILES.items():
    rows=load(path); n=len(rows)
    cl,hi,lo,sma20,sd20,rsi14,cci14,atr14,ml,ms,mh=precompute(rows)
    for i in range(50,n-1):
        last=rows[i]; prev=rows[i-1]
        for streak in [2,3,4,5]:
            if i<streak: continue
            au=all(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
            ad=all(cl[i-s]<cl[i-s-1] for s in range(1,streak+1))
            if au: r=results[sym][f'REV{streak}']; r[1]+=1; r[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            elif ad: r=results[sym][f'REV{streak}']; r[1]+=1; r[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        for streak in [2,3]:
            if i<streak: continue
            au=all(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
            ad=all(cl[i-s]<cl[i-s-1] for s in range(1,streak+1))
            if not (au or ad): continue
            ar=sum(rows[i-s]['h']-rows[i-s]['l'] for s in range(1,streak+1))/streak
            lr=prev['h']-prev['l']
            if lr>ar*1.3:
                k=f'REV{streak}_WIDE'
                if au: r=results[sym][k]; r[1]+=1; r[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
                else: r=results[sym][k]; r[1]+=1; r[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        r=rsi14[i]
        if r is not None:
            if r<=25 and last['c']>last['o']:
                r2=results[sym]['RSI25_GREEN']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if r>=75 and last['c']<last['o']:
                r2=results[sym]['RSI75_RED']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            body=abs(last['c']-last['o']); md=(last['h']+last['l'])/2; bp=body/md*100 if md else 0
            if r<=25 and bp>0.02:
                r2=results[sym]['RSI25_BIGBODY']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if r>=75 and bp>0.02:
                r2=results[sym]['RSI75_BIGBODY']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if i>20:
                rp=rsi14[i-1]
                if rp is not None:
                    l5=min(cl[i-5:i+1]); l4=min(cl[i-5:i])
                    if l5<l4 and r>rp:
                        r2=results[sym]['RSI_BULL_DIV']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
                    h5=max(cl[i-5:i+1]); h4=max(cl[i-5:i])
                    if h5>h4 and r<rp:
                        r2=results[sym]['RSI_BEAR_DIV']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            for streak in [2,3]:
                if i<streak: continue
                au=all(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
                ad=all(cl[i-s]<cl[i-s-1] for s in range(1,streak+1))
                if au and r>=70:
                    r2=results[sym][f'REV{streak}_RSI70']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
                if ad and r<=30:
                    r2=results[sym][f'REV{streak}_RSI30']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        m=sma20[i]; sd=sd20[i]
        if m is not None and sd:
            u2=m+2*sd; l2=m-2*sd; u25=m+2.5*sd; l25=m-2.5*sd
            if prev['l']<=l2 and last['c']>l2 and last['c']>last['o']:
                r2=results[sym]['BB_LOWER_BOUNCE']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['h']>=u2 and last['c']<u2 and last['c']<last['o']:
                r2=results[sym]['BB_UPPER_BOUNCE']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if last['c']>=u2 and last['c']>last['o']:
                r2=results[sym]['BB_UPPER_WALK']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if last['c']<=l2 and last['c']<last['o']:
                r2=results[sym]['BB_LOWER_WALK']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            for streak in [2,3]:
                if i<streak: continue
                au=all(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
                ad=all(cl[i-s]<cl[i-s-1] for s in range(1,streak+1))
                if au and prev['h']>=m+2*sd:
                    r2=results[sym][f'REV{streak}_BBTOP']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
                if ad and prev['l']<=m-2*sd:
                    r2=results[sym][f'REV{streak}_BBBTM']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        pb=abs(prev['c']-prev['o']); lb=abs(last['c']-last['o'])
        if pb>0:
            if prev['c']<prev['o'] and last['c']>last['o'] and last['o']<prev['c'] and last['c']>prev['o']:
                r2=results[sym]['ENGULF_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['c']>prev['o'] and last['c']<last['o'] and last['o']>prev['c'] and last['c']<prev['o']:
                r2=results[sym]['ENGULF_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if prev['c']<prev['o'] and last['c']>last['o'] and lb>pb*1.5:
                r2=results[sym]['ENGULF_BULL_BIG']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['c']>prev['o'] and last['c']<last['o'] and lb>pb*1.5:
                r2=results[sym]['ENGULF_BEAR_BIG']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        rng=last['h']-last['l']; body=abs(last['c']-last['o'])
        if rng>0:
            uw=last['h']-max(last['c'],last['o']); lw=min(last['c'],last['o'])-last['l']
            if lw>body*2 and lw/rng>=0.6 and body/rng<=0.3 and last['c']>last['o']:
                r2=results[sym]['HAMMER']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if uw>body*2 and uw/rng>=0.6 and body/rng<=0.3 and last['c']<last['o']:
                r2=results[sym]['SHOOTING_STAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            l3=min(r['l'] for r in rows[i-3:i]); h3=max(r['h'] for r in rows[i-3:i])
            if lw>body*2 and lw/rng>=0.6 and last['l']<=l3 and last['c']>last['o']:
                r2=results[sym]['HAMMER_SWING']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if uw>body*2 and uw/rng>=0.6 and last['h']>=h3 and last['c']<last['o']:
                r2=results[sym]['STAR_SWING']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if prev['h']>last['h'] and prev['l']<last['l']:
            d='RISE' if last['c']>last['o'] else 'FALL'; r2=results[sym]['INSIDE_BAR_'+d[:4]]; r2[1]+=1
            r2[0]+=1 if (d=='RISE' and rows[i+1]['c']>rows[i]['c']) or (d=='FALL' and rows[i+1]['c']<rows[i]['c']) else 0
        if last['h']>prev['h'] and last['l']<prev['l']:
            d='RISE' if last['c']>last['o'] else 'FALL'; r2=results[sym]['OUTSIDE_BAR_'+d[:4]]; r2[1]+=1
            r2[0]+=1 if (d=='RISE' and rows[i+1]['c']>rows[i]['c']) or (d=='FALL' and rows[i+1]['c']<rows[i]['c']) else 0
        gp=abs(last['o']-prev['c'])/prev['c']*100
        if last['o']>prev['c'] and gp>0.01:
            r2=results[sym]['GAP_UP']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if last['o']<prev['c'] and gp>0.01:
            r2=results[sym]['GAP_DN']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        if i>3:
            if all(cl[i-s]>cl[i-s-1] for s in [1,2,3]):
                r1=rows[i-1]['h']-rows[i-1]['l']; r2_=rows[i-2]['h']-rows[i-2]['l']; r3=rows[i-3]['h']-rows[i-3]['l']
                if r1<r2_<r3:
                    r2=results[sym]['EXHAUST_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if all(cl[i-s]<cl[i-s-1] for s in [1,2,3]):
                r1=rows[i-1]['h']-rows[i-1]['l']; r2_=rows[i-2]['h']-rows[i-2]['l']; r3=rows[i-3]['h']-rows[i-3]['l']
                if r1<r2_<r3:
                    r2=results[sym]['EXHAUST_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        if i>1:
            if prev['c']<prev['o'] and last['c']>last['o'] and last['c']>prev['h']:
                r2=results[sym]['BULL_REV_2C']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['c']>prev['o'] and last['c']<last['o'] and last['c']<prev['l']:
                r2=results[sym]['BEAR_REV_2C']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if i>13:
            sl=min(r['l'] for r in rows[i-12:i-2]); sh=max(r['h'] for r in rows[i-12:i-2])
            if prev['l']<sl and prev['c']>sl and last['c']>sl and last['c']>prev['c']:
                r2=results[sym]['FAKEOUT_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['h']>sh and prev['c']<sh and last['c']<sh and last['c']<prev['c']:
                r2=results[sym]['FAKEOUT_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        h=mh[i] if i<len(mh) else None; hp=mh[i-1] if i>0 and i-1<len(mh) else None
        if h is not None and hp is not None:
            if hp<0 and h>0:
                r2=results[sym]['MACD_CROSS_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if hp>0 and h<0:
                r2=results[sym]['MACD_CROSS_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        c=cci14[i]; cp=cci14[i-1] if i>0 else None
        if c is not None:
            if c>=150:
                r2=results[sym]['CCI150']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if c<=-150:
                r2=results[sym]['CCI150']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if cp is not None and cp<=-150 and c>cp:
                r2=results[sym]['CCI150_REV']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if cp is not None and cp>=150 and c<cp:
                r2=results[sym]['CCI150_REV']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if i>11:
            h10=max(r['h'] for r in rows[i-10:i]); l10=min(r['l'] for r in rows[i-10:i])
            if last['h']>=h10 and last['c']<last['o']:
                r2=results[sym]['SR_HIGH_REJECT']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
            if last['l']<=l10 and last['c']>last['o']:
                r2=results[sym]['SR_LOW_REJECT']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
        if i>1:
            if prev['c']>prev['o'] and last['c']>last['o'] and (last['h']-last['l'])>(prev['h']-prev['l']):
                r2=results[sym]['TWIN_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if prev['c']<prev['o'] and last['c']<last['o'] and (last['h']-last['l'])>(prev['h']-prev['l']):
                r2=results[sym]['TWIN_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if i>21:
            h20=max(r['h'] for r in rows[i-20:i]); l20=min(r['l'] for r in rows[i-20:i]); r20=h20-l20
            if r20>0:
                pos=(last['c']-l20)/r20
                if pos<=0.15 and last['c']>last['o']:
                    r2=results[sym]['RANGE_LOW_BOUNCE']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
                if pos>=0.85 and last['c']<last['o']:
                    r2=results[sym]['RANGE_HIGH_REJECT']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if i>=3 and i%4==0:
            o3h=max(r['h'] for r in rows[i-3:i+1]); o3l=min(r['l'] for r in rows[i-3:i+1])
            if last['c']>last['o'] and last['c']>o3h:
                r2=results[sym]['BREAKOUT_BULL']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']>rows[i]['c'] else 0
            if last['c']<last['o'] and last['c']<o3l:
                r2=results[sym]['BREAKOUT_BEAR']; r2[1]+=1; r2[0]+=1 if rows[i+1]['c']<rows[i]['c'] else 0
        if i>3:
            p2=rows[i-2]
            if p2['h']>prev['h'] and p2['l']<prev['l'] and prev['h']<last['h'] and prev['l']>last['l']:
                d='RISE' if last['c']>last['o'] else 'FALL'; nm='BULL' if d=='RISE' else 'BEAR'
                r2=results[sym]['CONTRACTION_EXPAND_'+nm]; r2[1]+=1
                r2[0]+=1 if (d=='RISE' and rows[i+1]['c']>rows[i]['c']) or (d=='FALL' and rows[i+1]['c']<rows[i]['c']) else 0

print("="*130)
print("TOP STRATEGIES BY MARKET (WR >= 55%, >= 10 trades)")
print("="*130)
for sym in sorted(results.keys()):
    items=[(n,d[0],d[1]) for n,d in results[sym].items() if d[1]>=10]
    items.sort(key=lambda x:-x[1]/x[2]*100)
    best=[x for x in items if x[1]/x[2]*100>=55]
    if best:
        print(f"\n--- {sym} ---")
        for name,wins,total in best[:10]:
            print(f"  {name:<30} {wins:>4}/{total:<4} = {wins/total*100:>5.1f}%")
        top=best[0]; print(f"  -> BEST: {top[0]} @ {top[1]/top[2]*100:.1f}% ({top[1]}/{top[2]})")

print("\n"+"="*130)
print("CROSS-MARKET WINRATE (strategies averaged across all markets)")
print("="*130)
agg=defaultdict(lambda:{'wins':0,'total':0,'mwrs':[]})
for sym in results:
    for name,(wins,total) in results[sym].items():
        if total<5: continue
        a=agg[name]; a['wins']+=wins; a['total']+=total; a['mwrs'].append((sym,wins/total*100))
cross=[(n,d['wins'],d['total']) for n,d in agg.items() if d['total']>=20]
cross.sort(key=lambda x:-x[1]/x[2]*100)
for name,wins,total in cross:
    wr=wins/total*100
    if wr>=54:
        mstr=', '.join(f"{m}({w:.0f}%)" for m,w in sorted(agg[name]['mwrs'],key=lambda x:-x[1])[:3])
        print(f"{name:<30} {wins:>5}/{total:<5} = {wr:>5.1f}%  [{mstr}]")

print("\n"+"="*130)
print("HIGH_WR (>5 trades)")
print("="*130)
candidates=[]
for sym in results:
    for name,(wins,total) in results[sym].items():
        if total>=5 and wins/total*100>=75:
            candidates.append((sym,name,wins,total,wins/total*100))
candidates.sort(key=lambda x:-x[4])
for sym,name,wins,total,wr in candidates:
    print(f"{sym:<8} {name:<30} {wins:>3}/{total:<3} = {wr:>5.1f}%")
