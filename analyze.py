import csv, math, json
from collections import defaultdict
from pathlib import Path

FILES = {k: Path(rf"C:\Users\b0231\Downloads\{k}_15s.csv") for k in [
    'R_10','R_25','R_50','R_75','R_100','1HZ10V','1HZ25V','1HZ50V','1HZ75V','1HZ100V']}

def load_csv(path):
    with open(path) as f:
        return [{'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
                 'c':float(r['close']),'t':int(r['time_unix'])} for r in csv.DictReader(f)]

def sma(arr,n):
    return None if len(arr)<n else sum(arr[-n:])/n

def rsi_arr(closes,n=14):
    if len(closes)<n+1: return None
    g=l=0
    for i in range(-n,0):
        d=closes[i]-closes[i-1]
        if d>0: g+=d
        else: l-=d
    ag=g/n; al=l/n
    return 100 if al==0 else 100-100/(1+ag/al)

def analyze_market(name,rows):
    cl=[r['c'] for r in rows]; hi=[r['h'] for r in rows]; lo=[r['l'] for r in rows]
    n=len(rows)
    if n<50: return None
    ranges=[r['h']-r['l'] for r in rows]
    avg_r=sum(ranges)/len(ranges); mp=sum(cl)/len(cl)
    avg_rp=avg_r/mp*100 if mp else 0
    same_w={2:0,3:0,4:0}; same_t={2:0,3:0,4:0}
    opp_w={2:0,3:0,4:0}; opp_t={2:0,3:0,4:0}
    for i in range(5,n-1):
        for streak in [2,3,4]:
            if i<streak+1: continue
            au=all(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
            ad=not any(cl[i-s]>cl[i-s-1] for s in range(1,streak+1))
            if au or ad:
                d='RISE' if au else 'FALL'; nm=cl[i]>cl[i-1]
                won=(d=='RISE' and nm) or (d=='FALL' and not nm)
                same_t[streak]+=1
                if won: same_w[streak]+=1
                ow=(d=='RISE' and not nm) or (d=='FALL' and nm)
                opp_t[streak]+=1
                if ow: opp_w[streak]+=1
    rev_w=rev_t=0
    for i in range(2,n-1):
        pr=hi[i-1]-lo[i-1]; cr=hi[i]-lo[i]
        pd=cl[i-1]>cl[i-2]; cd=cl[i]>cl[i-1]
        if cr>avg_r*1.5 and pd!=cd:
            rev_t+=1
            if i+1<n and (cl[i+1]>cl[i])==cd: rev_w+=1
    rsi_w=rsi_t=0
    for i in range(16,n-1):
        r=rsi_arr(cl[:i+1],14)
        if r is None: continue
        rp=rsi_arr(cl[:i],14)
        if rp is None: continue
        last=rows[i]
        if rp<=25 and r>rp and last['c']>last['o']:
            rsi_t+=1
            if i+1<n and cl[i+1]>cl[i]: rsi_w+=1
        elif rp>=75 and r<rp and last['c']<last['o']:
            rsi_t+=1
            if i+1<n and cl[i+1]<cl[i]: rsi_w+=1
    ups=sum(1 for i in range(1,n) if cl[i]>cl[i-1]); dns=n-1-ups
    return {'name':name,'candles':n,'price':round(mp,2),'avg_range':round(avg_r,4),
            'avg_range_pct':round(avg_rp,4),'up_pct':round(ups/(n-1)*100,1),
            'down_pct':round(dns/(n-1)*100,1),
            'reversal_after_big_move':f"{rev_w}/{rev_t} ({round(rev_w/rev_t*100,1) if rev_t else 0}%)",
            'rsi_extreme':f"{rsi_w}/{rsi_t} ({round(rsi_w/rsi_t*100,1) if rsi_t else 0}%)"}

def analyze_mr(name,rows):
    cl=[r['c'] for r in rows]; n=len(rows)
    if n<50: return {}
    r={}
    for streak in [1,2,3,4]:
        w=t=0
        for i in range(streak+2,n-1):
            sd=True; pd=None
            for s in range(streak):
                cd=cl[i-1-s]>cl[i-2-s]
                if s>0 and cd!=pd: sd=False; break
                pd=cd
            if not sd: continue
            au=cl[i-1]>cl[i-2]; t+=1
            if au and cl[i]<cl[i-1]: w+=1
            elif not au and cl[i]>cl[i-1]: w+=1
        r[f'reversal_after_{streak}']=f"{w}/{t} ({round(w/t*100,1) if t else 0}%)"
    return r

def analyze_bb(name,rows):
    cl=[r['c'] for r in rows]; n=len(rows)
    if n<22: return {}
    w2=t2=0; w25=t25=0
    for i in range(22,n-1):
        ck=cl[i-20:i]; m=sum(ck)/20; var=sum((x-m)**2 for x in ck)/20; sd=math.sqrt(var) if var>0 else 0
        if sd==0: continue
        u2=m+2*sd; l2=m-2*sd; u25=m+2.5*sd; l25=m-2.5*sd
        prv=rows[i-1]; cur=rows[i]
        if prv['l']<=l25 and cur['c']>l25 and cur['c']>cur['o']:
            t25+=1
            if i+1<n and cl[i+1]>cl[i]: w25+=1
        if prv['h']>=u25 and cur['c']<u25 and cur['c']<cur['o']:
            t25+=1
            if i+1<n and cl[i+1]<cl[i]: w25+=1
        if prv['l']<=l2 and cur['c']>l2 and cur['c']>cur['o']:
            t2+=1
            if i+1<n and cl[i+1]>cl[i]: w2+=1
        if prv['h']>=u2 and cur['c']<u2 and cur['c']<cur['o']:
            t2+=1
            if i+1<n and cl[i+1]<cl[i]: w2+=1
    r={}
    if t2: r['bb_2s']=f"{w2}/{t2} ({round(w2/t2*100,1)}%)"
    if t25: r['bb_2p5s']=f"{w25}/{t25} ({round(w25/t25*100,1)}%)"
    return r

def analyze_rv(name,rows):
    cl=[r['c'] for r in rows]; n=len(rows)
    if n<20: return {}
    ranges=[r['h']-r['l'] for r in rows]
    mp=sum(cl)/len(cl)
    sp=sorted([(h_l/mp*100) for h_l in ranges])
    l4=len(sp)//4
    return {'range_pct_p25':round(sp[l4],4),'range_pct_p50':round(sp[l4*2],4),'range_pct_p75':round(sp[l4*3],4)}

print("="*100)
print("DERIV SYNTHETIC INDICES — 15s CANDLE ANALYSIS")
print("="*100)
all_results={}
for sym,path in FILES.items():
    rows=load_csv(path)
    r=analyze_market(sym,rows)
    if r:
        r.update(analyze_mr(sym,rows))
        r.update(analyze_bb(sym,rows))
        r.update(analyze_rv(sym,rows))
        all_results[sym]=r
for sym,r in all_results.items():
    if not r: continue
    print(f"\n--- {sym} ({r.get('candles',0)} candles, ~${r.get('price',0)}) ---")
    print(f"  Avg range: {r.get('avg_range_pct','?')}%  |  Up/Down: {r.get('up_pct','?')}/{r.get('down_pct','?')}%")
    print(f"  Range P25/P50/P75: {r.get('range_pct_p25','?')}/{r.get('range_pct_p50','?')}/{r.get('range_pct_p75','?')}%")
    print(f"  Reversal after big move: {r.get('reversal_after_big_move','?')}")
    print(f"  RSI extreme reversal: {r.get('rsi_extreme','?')}")
    for s in ['reversal_after_1','reversal_after_2','reversal_after_3','reversal_after_4']:
        if s in r: print(f"  {s}: {r[s]}")
    for b in ['bb_2s','bb_2p5s']:
        if b in r: print(f"  {b}: {r[b]}")
print("\n"+"="*100)
print("OPTIMAL STRATEGY PARAMETERS")
print("="*100)
for th in ['range_pct_p25','range_pct_p50','range_pct_p75']:
    vals=[r[th] for r in all_results.values() if th in r]
    if vals: print(f"  Avg {th}: {round(sum(vals)/len(vals),4)}%")
print("\n// JSON for bot.html evaluateAndTrade:")
print(json.dumps({k:{'avg_range_pct':v.get('avg_range_pct'),'range_p25':v.get('range_pct_p25'),'range_p50':v.get('range_pct_p50'),'range_p75':v.get('range_pct_p75'),'up_pct':v.get('up_pct')} for k,v in all_results.items()},indent=2))
