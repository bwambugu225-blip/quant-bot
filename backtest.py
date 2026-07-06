import csv, json, math, time, itertools
from pathlib import Path

CSV_DIR = Path(r"C:\Users\b0231\Downloads")
MARKETS = ["R_10","R_25","R_50","R_75","R_100","1HZ10V","1HZ25V","1HZ50V","1HZ75V","1HZ100V"]

def load_csv(path):
    with open(path) as f:
        return [[int(r["time_unix"]),float(r["open"]),float(r["high"]),float(r["low"]),float(r["close"]),int(r["ticks"])] for r in csv.DictReader(f)]

def ema(arr, p):
    if len(arr)<p: return None
    k=2/(p+1); e=sum(arr[:p])/p
    for i in range(p,len(arr)): e=arr[i]*k+e*(1-k)
    return e

def test_strategy(candles, strategy_fn):
    trades=[]
    for i in range(len(candles)-1):
        d=strategy_fn(candles,i)
        if d:
            nxt=candles[i+1]
            trades.append((d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1]))
    return trades

def t_wr(c,i,p=14,os=-85,ob=-20,rw=False,mw=0.35):
    if i<p+1: return None
    s=i-p+1; hi=max(c[j][2] for j in range(s,i+1)); lo=min(c[j][3] for j in range(s,i+1))
    wr=-50 if hi==lo else ((hi-c[i][4])/(hi-lo))*-100
    ci=c[i]
    if wr<os and ci[4]>ci[1]:
        if rw:
            rg=ci[2]-ci[3]
            if rg<=0: return None
            if (min(ci[1],ci[4])-ci[3])/rg<mw: return None
        return 'RISE'
    if wr>ob and ci[4]<ci[1]:
        if rw:
            rg=ci[2]-ci[3]
            if rg<=0: return None
            if (ci[2]-max(ci[1],ci[4]))/rg<mw: return None
        return 'FALL'
    return None

def t_trend_follow(c,i,lb=3):
    if i<lb+1: return None
    g=all(c[i-j][4]>c[i-j][1] for j in range(lb))
    r=all(c[i-j][4]<c[i-j][1] for j in range(lb))
    return 'RISE' if g else 'FALL' if r else None

def t_trend_boost(c,i,lb=3,mp=0.6):
    if i<lb: return None
    g=sum(1 for j in range(i-lb+1,i+1) if c[j][4]>c[j][1]); r=lb-g
    if g>=lb*mp and c[i][4]>c[i][1]: return 'RISE'
    if r>=lb*mp and c[i][4]<c[i][1]: return 'FALL'
    return None

def t_bb_breakout(c,i,p=20,sd_m=2.0):
    if i<p+1: return None
    s=i-p+1; a=[c[j][4] for j in range(s,i+1)]
    m=sum(a)/p; sd=math.sqrt(sum((x-m)**2 for x in a)/p)
    if sd==0: return None
    u=m+sd_m*sd; l=m-sd_m*sd; ci=c[i]
    if ci[4]>u and ci[4]>ci[1]: return 'RISE'
    if ci[4]<l and ci[4]<ci[1]: return 'FALL'
    return None

def t_ema_cross(c,i,fast=5,slow=20):
    if i<slow+2: return None
    cl=[c[j][4] for j in range(i+1)]
    ef=ema(cl,fast); es=ema(cl,slow)
    if ef is None or es is None: return None
    pc=cl[:-1]; efp=ema(pc,fast); esp=ema(pc,slow)
    if efp is None or esp is None: return None
    ci=c[i]
    if efp<=esp and ef>es and ci[4]>ci[1]: return 'RISE'
    if efp>=esp and ef<es and ci[4]<ci[1]: return 'FALL'
    return None

def t_momentum(c,i,lb=5,th=0.5):
    if i<lb: return None
    pch=(c[i][4]-c[i-lb][4])/c[i-lb][4]*100 if c[i-lb][4]!=0 else 0; ci=c[i]
    if pch>th and ci[4]>ci[1]: return 'RISE'
    if pch<-th and ci[4]<ci[1]: return 'FALL'
    return None

def t_vol_exp(c,i,lb=10,mult=1.5):
    if i<lb+1: return None
    rngs=[c[j][2]-c[j][3] for j in range(i-lb,i)]; avg=sum(rngs)/lb; cur=c[i][2]-c[i][3]
    if avg==0: return None; ci=c[i]
    if cur>avg*mult and ci[4]>ci[1]: return 'RISE'
    if cur>avg*mult and ci[4]<ci[1]: return 'FALL'
    return None

def t_rev_trend(c,i,tn=4,wm=0.5):
    if i<tn+2: return None; ci=c[i]; pv=c[i-1]
    dn=all(c[i-j][4]<c[i-j][1] for j in range(1,tn+1))
    up=all(c[i-j][4]>c[i-j][1] for j in range(1,tn+1))
    rg=ci[2]-ci[3]
    if rg<=0: return None
    lw=(min(ci[1],ci[4])-ci[3])/rg; uw=(ci[2]-max(ci[1],ci[4]))/rg
    if dn and ci[4]>ci[1] and lw>=wm and ci[4]>pv[4]: return 'RISE'
    if up and ci[4]<ci[1] and uw>=wm and ci[4]<pv[4]: return 'FALL'
    return None

def t_sr_bounce(c,i,lb=20):
    if i<lb+2: return None
    hi_lb=max(c[j][2] for j in range(i-lb,i)); lo_lb=min(c[j][3] for j in range(i-lb,i))
    band=(hi_lb-lo_lb)*0.02; ci=c[i]; rg=ci[2]-ci[3]
    if rg<=0: return None
    lw=(min(ci[1],ci[4])-ci[3])/rg; uw=(ci[2]-max(ci[1],ci[4]))/rg
    if ci[3]<=lo_lb+band and ci[4]>ci[1] and lw>=0.4: return 'RISE'
    if ci[2]>=hi_lb-band and ci[4]<ci[1] and uw>=0.4: return 'FALL'
    return None

def add_result(results, sigs, label):
    if len(sigs)>=10:
        w=sum(1 for x in sigs if x)
        results.append({'s':label,'wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})

def main():
    t_start=time.time()
    all_results=[]
    for mi,m in enumerate(MARKETS):
        path=CSV_DIR/f"{m}_15s.csv"
        if not path.exists(): continue
        c=load_csv(path); t0=time.time(); n=len(c)
        print(f"\n[{mi+1}/10] {m}: {n} candles",flush=True)
        results=[]
        for p,os,wick in itertools.product([7,10,14],[-95,-90,-85,-80,-75],[False,True]):
            sigs=test_strategy(c,lambda c,i,p=p,os=os,wick=wick: t_wr(c,i,p,os,-20,wick,0.35))
            add_result(results,sigs,f'W{abs(os)}P{p}W{int(wick)}')
        for lb in [2,3,4]:
            sigs=test_strategy(c,lambda c,i,lb=lb: t_trend_follow(c,i,lb))
            add_result(results,sigs,f'TF{lb}')
        for lb,mp in itertools.product([5,8],[0.6,0.7,0.8]):
            sigs=test_strategy(c,lambda c,i,lb=lb,mp=mp: t_trend_boost(c,i,lb,mp))
            add_result(results,sigs,f'TB{lb}_{int(mp*100)}')
        for sd_m in [1.5,2.0,2.5,3.0]:
            sigs=test_strategy(c,lambda c,i,sd_m=sd_m: t_bb_breakout(c,i,20,sd_m))
            add_result(results,sigs,f'BBO{int(sd_m*10)}')
        sigs=test_strategy(c,lambda c,i: t_ema_cross(c,i,5,20))
        add_result(results,sigs,'EMA5_20')
        for lb,th in itertools.product([3,5,8],[0.3,0.5,1.0]):
            sigs=test_strategy(c,lambda c,i,lb=lb,th=th: t_momentum(c,i,lb,th))
            add_result(results,sigs,f'MOM{lb}_{th}')
        for mult in [1.3,1.5,2.0]:
            sigs=test_strategy(c,lambda c,i,mult=mult: t_vol_exp(c,i,10,mult))
            add_result(results,sigs,f'VOL{int(mult*10)}')
        for tn,wm in itertools.product([3,4],[0.4,0.5]):
            sigs=test_strategy(c,lambda c,i,tn=tn,wm=wm: t_rev_trend(c,i,tn,wm))
            add_result(results,sigs,f'REV{tn}_{int(wm*100)}')
        sigs=test_strategy(c,lambda c,i: t_sr_bounce(c,i,20))
        add_result(results,sigs,'SR20')
        for p,os,trend_lb,trend_type in itertools.product([7,10,14],[-90,-85,-80],[2,3],['follow','boost']):
            sigs=[]
            for i in range(50,n-1):
                d=t_wr(c,i,p,os,-20,False,0.35)
                if d is None: continue
                td=t_trend_follow(c,i,trend_lb) if trend_type=='follow' else t_trend_boost(c,i,trend_lb,0.6)
                if td!=d: continue
                nxt=c[i+1]; sigs.append((d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1]))
            add_result(results,sigs,f'W{abs(os)}P{p}+T{trend_lb}{trend_type[0]}')
        for p,os,mom_lb in itertools.product([7,10,14],[-90,-85,-80],[3,5]):
            sigs=[]
            for i in range(50,n-1):
                d=t_wr(c,i,p,os,-20,False,0.35)
                if d is None: continue
                md=t_momentum(c,i,mom_lb,0.3)
                if md!=d: continue
                nxt=c[i+1]; sigs.append((d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1]))
            add_result(results,sigs,f'W{abs(os)}P{p}+M{mom_lb}')
        for p,os,mult in itertools.product([7,10,14],[-90,-85,-80],[1.3,1.5]):
            sigs=[]
            for i in range(50,n-1):
                d=t_wr(c,i,p,os,-20,False,0.35)
                if d is None: continue
                vd=t_vol_exp(c,i,10,mult)
                if vd!=d: continue
                nxt=c[i+1]; sigs.append((d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1]))
            add_result(results,sigs,f'W{abs(os)}P{p}+V{int(mult*10)}')
        for lb,mom_lb,th in itertools.product([2,3],[3,5],[0.3,0.5]):
            sigs=[]
            for i in range(50,n-1):
                d=t_trend_follow(c,i,lb)
                if d is None: continue
                md=t_momentum(c,i,mom_lb,th)
                if md!=d: continue
                nxt=c[i+1]; sigs.append((d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1]))
            add_result(results,sigs,f'TF{lb}+M{mom_lb}_{th}')
        results.sort(key=lambda x: -x['wr'])
        print(f"  Top [{time.time()-t0:.0f}s]:",flush=True)
        print(f"  {'Strat':<24} {'WR%':<8} {'T':<6} {'W':<6}",flush=True)
        print(f"  {'-'*46}",flush=True)
        for r in results[:30]:
            if r['t']>=15: print(f"  {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6} {r['w']:<6}",flush=True)
        for r in results: r['m']=m
        all_results.extend(results)
    print(f"\n\n{'='*60}",flush=True); print(f"BEST PER MARKET (>=50 trades)",flush=True); print(f"{'='*60}",flush=True)
    print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}",flush=True); print("-"*50,flush=True)
    for m in MARKETS:
        mrs=[r for r in all_results if r['m']==m and r['t']>=50]
        mrs.sort(key=lambda x: -x['wr'])
        if mrs:
            r=mrs[0]; print(f"{m:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}",flush=True)
    elite=[r for r in all_results if r['wr']>=75 and r['t']>=10]
    if elite:
        print(f"\n\n{'='*60}",flush=True); print(f"ELITE (>=75% WR, >=10 trades)",flush=True); print(f"{'='*60}",flush=True)
        print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}",flush=True); print("-"*50,flush=True)
        elite.sort(key=lambda x: -x['wr'])
        for r in elite[:15]: print(f"{r['m']:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}",flush=True)
    best100=[r for r in all_results if r['t']>=100]
    best100.sort(key=lambda x: -x['wr'])
    if best100:
        print(f"\n\n{'='*60}",flush=True); print(f"BEST WITH >=100 TRADES",flush=True); print(f"{'='*60}",flush=True)
        print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}",flush=True); print("-"*50,flush=True)
        seen=set()
        for r in best100[:20]:
            k=(r['m'],r['s'])
            if k not in seen: seen.add(k); print(f"{r['m']:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}",flush=True)
    with open(Path(r"C:\Users\b0231\Desktop\step master")/"backtest_results.json","w") as f:
        json.dump(all_results,f,indent=2)
    print(f"\nDone: {time.time()-t_start:.0f}s, {len(all_results)} results",flush=True)

if __name__=="__main__":
    main()
