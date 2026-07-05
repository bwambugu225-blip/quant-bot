import csv, json, math, time
from pathlib import Path

CSV_DIR = Path(r"C:\Users\b0231\Downloads")
MARKETS = ["R_10","R_25","R_50","R_75","R_100","1HZ10V","1HZ25V","1HZ50V","1HZ75V","1HZ100V"]

def load_csv(path):
    rows=[]
    with open(path) as f:
        for row in csv.DictReader(f):
            rows.append([int(row["time_unix"]),float(row["open"]),float(row["high"]),float(row["low"]),float(row["close"]),int(row["ticks"])])
    return rows

def ema(arr, p):
    if len(arr)<p: return None
    k=2/(p+1); e=sum(arr[:p])/p
    for i in range(p,len(arr)): e=arr[i]*k+e*(1-k)
    return e

def test_strategy(candles, strategy_fn):
    """Run a strategy function over all candles. Returns trade results."""
    trades=[]
    n=len(candles)
    for i in range(n-1):
        trade=strategy_fn(candles, i)
        if trade:
            direction=trade
            nxt=candles[i+1]
            won=(direction=='RISE' and nxt[4]>nxt[1]) or (direction=='FALL' and nxt[4]<nxt[1])
            trades.append(won)
    return trades

# ── STRATEGY DEFINITIONS ──

def t_wr(c, i, p=14, os=-85, ob=-20, req_wick=False, mw=0.35):
    """Williams %R mean reversion"""
    if i<p+1: return None
    hi=max(c[j][2] for j in range(i-p+1,i+1))
    lo=min(c[j][3] for j in range(i-p+1,i+1))
    wr=-50 if hi==lo else ((hi-c[i][4])/(hi-lo))*-100
    ci=c[i]
    if wr<os and ci[4]>ci[1]:
        if req_wick:
            rg=ci[2]-ci[3]
            if rg<=0: return None
            if (min(ci[1],ci[4])-ci[3])/rg<mw: return None
        return 'RISE'
    if wr>ob and ci[4]<ci[1]:
        if req_wick:
            rg=ci[2]-ci[3]
            if rg<=0: return None
            if (ci[2]-max(ci[1],ci[4]))/rg<mw: return None
        return 'FALL'
    return None

def t_trend_follow(c, i, lookback=3):
    """Follow the trend: if N consecutive in same direction, bet on continuation"""
    if i<lookback+1: return None
    green=all(c[i-j][4]>c[i-j][1] for j in range(lookback))
    red=all(c[i-j][4]<c[i-j][1] for j in range(lookback))
    if green: return 'RISE'
    if red: return 'FALL'
    return None

def t_trend_boost(c, i, lookback=3, min_pct=0.6):
    """Trend: majority direction in last N, with wi"""
    if i<lookback: return None
    g=sum(1 for j in range(i-lookback+1,i+1) if c[j][4]>c[j][1])
    r=lookback-g
    if g>=lookback*min_pct and c[i][4]>c[i][1]: return 'RISE'
    if r>=lookback*min_pct and c[i][4]<c[i][1]: return 'FALL'
    return None

def t_bb_breakout(c, i, p=20, sd_m=2.0):
    """BB breakout: price closes outside bands, bet on continuation"""
    if i<p+1: return None
    a=[c[j][4] for j in range(i-p+1,i+1)]
    m=sum(a)/p
    sd=math.sqrt(sum((x-m)**2 for x in a)/p)
    if sd==0: return None
    upper=m+sd_m*sd; lower=m-sd_m*sd
    ci=c[i]
    if ci[4]>upper and ci[4]>ci[1]: return 'RISE'
    if ci[4]<lower and ci[4]<ci[1]: return 'FALL'
    return None

def t_ema_cross(c, i, fast=5, slow=20):
    """EMA cross: fast crosses above slow"""
    if i<slow+2: return None
    cl=[c[j][4] for j in range(i+1)]
    e_fast=ema(cl,fast); e_slow=ema(cl,slow)
    if e_fast is None or e_slow is None: return None
    prev_cl=cl[:-1]
    e_fast_p=ema(prev_cl,fast); e_slow_p=ema(prev_cl,slow)
    if e_fast_p is None or e_slow_p is None: return None
    ci=c[i]
    if e_fast_p<=e_slow_p and e_fast>e_slow and ci[4]>ci[1]: return 'RISE'
    if e_fast_p>=e_slow_p and e_fast<e_slow and ci[4]<ci[1]: return 'FALL'
    return None

def t_momentum(c, i, lookback=5, threshold=0.5):
    """Momentum: price change over N candles exceeds threshold %"""
    if i<lookback: return None
    pct_chg=(c[i][4]-c[i-lookback][4])/c[i-lookback][4]*100 if c[i-lookback][4]!=0 else 0
    ci=c[i]
    if pct_chg>threshold and ci[4]>ci[1]: return 'RISE'
    if pct_chg<-threshold and ci[4]<ci[1]: return 'FALL'
    return None

def t_volatility_expansion(c, i, lookback=10, mult=1.5):
    """Volatility expansion: current range > avg range * mult"""
    if i<lookback+1: return None
    rngs=[c[j][2]-c[j][3] for j in range(i-lookback,i)]
    avg=sum(rngs)/lookback
    cur=c[i][2]-c[i][3]
    if avg==0: return None
    ci=c[i]
    if cur>avg*mult and ci[4]>ci[1]: return 'RISE'
    if cur>avg*mult and ci[4]<ci[1]: return 'FALL'
    return None

def t_reversal_after_trend(c, i, trend_n=4, wick_min=0.5):
    """Reversal: strong N-candle trend + wick rejection"""
    if i<trend_n+2: return None
    ci=c[i]; pv=c[i-1]
    dn=all(c[i-j][4]<c[i-j][1] for j in range(1,trend_n+1))
    up=all(c[i-j][4]>c[i-j][1] for j in range(1,trend_n+1))
    rg=ci[2]-ci[3]
    if rg<=0: return None
    lw=(min(ci[1],ci[4])-ci[3])/rg
    uw=(ci[2]-max(ci[1],ci[4]))/rg
    if dn and ci[4]>ci[1] and lw>=wick_min and ci[4]>pv[4]: return 'RISE'
    if up and ci[4]<ci[1] and uw>=wick_min and ci[4]<pv[4]: return 'FALL'
    return None

def t_support_resistance(c, i, lookback=20):
    """Support/Resistance bounce"""
    if i<lookback+2: return None
    hi_lb=max(c[j][2] for j in range(i-lookback,i))
    lo_lb=min(c[j][3] for j in range(i-lookback,i))
    band=(hi_lb-lo_lb)*0.02
    ci=c[i]; pv=c[i-1]
    rg=ci[2]-ci[3]
    if rg<=0: return None
    lw=(min(ci[1],ci[4])-ci[3])/rg
    uw=(ci[2]-max(ci[1],ci[4]))/rg
    # Near support: price near recent low + bullish wick
    if ci[3]<=lo_lb+band and ci[4]>ci[1] and lw>=0.4: return 'RISE'
    # Near resistance: price near recent high + bearish wick
    if ci[2]>=hi_lb-band and ci[4]<ci[1] and uw>=0.4: return 'FALL'
    return None

def main():
    t_start=time.time()
    all_results=[]
    
    for mi,m in enumerate(MARKETS):
        path=CSV_DIR/f"{m}_15s.csv"
        if not path.exists(): continue
        c=load_csv(path)
        t0=time.time()
        n=len(c)
        print(f"\n[{mi+1}/10] {m}: {n} candles",flush=True)
        results=[]
        
        # 1. Williams %R (various params)
        for p in [7,10,14]:
            for os in [-95,-90,-85,-80,-75]:
                for wick in [False,True]:
                    sigs=test_strategy(c, lambda c,i,p=p,os=os,wick=wick: t_wr(c,i,p,os,-20,wick,0.35))
                    if len(sigs)>=10:
                        w=sum(1 for x in sigs if x)
                        results.append({'s':f'W{abs(os)}P{p}W{int(wick)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 2. Trend follow
        for lb in [2,3,4]:
            sigs=test_strategy(c, lambda c,i,lb=lb: t_trend_follow(c,i,lb))
            if len(sigs)>=10:
                w=sum(1 for x in sigs if x)
                results.append({'s':f'TF{lb}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 3. Trend boost (majority)
        for lb in [5,8]:
            for mp in [0.6,0.7,0.8]:
                sigs=test_strategy(c, lambda c,i,lb=lb,mp=mp: t_trend_boost(c,i,lb,mp))
                if len(sigs)>=10:
                    w=sum(1 for x in sigs if x)
                    results.append({'s':f'TB{lb}_{int(mp*100)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 4. BB breakout
        for sd_m in [1.5,2.0,2.5,3.0]:
            sigs=test_strategy(c, lambda c,i,sd_m=sd_m: t_bb_breakout(c,i,20,sd_m))
            if len(sigs)>=10:
                w=sum(1 for x in sigs if x)
                results.append({'s':f'BBO{int(sd_m*10)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 5. EMA cross
        sigs=test_strategy(c, lambda c,i: t_ema_cross(c,i,5,20))
        if len(sigs)>=10:
            w=sum(1 for x in sigs if x)
            results.append({'s':'EMA5_20','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 6. Momentum
        for lb in [3,5,8]:
            for thresh in [0.3,0.5,1.0]:
                sigs=test_strategy(c, lambda c,i,lb=lb,th=thresh: t_momentum(c,i,lb,th))
                if len(sigs)>=10:
                    w=sum(1 for x in sigs if x)
                    results.append({'s':f'MOM{lb}_{thresh}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 7. Volatility expansion
        for mult in [1.3,1.5,2.0]:
            sigs=test_strategy(c, lambda c,i,mult=mult: t_volatility_expansion(c,i,10,mult))
            if len(sigs)>=10:
                w=sum(1 for x in sigs if x)
                results.append({'s':f'VOL{int(mult*10)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 8. Reversal after trend
        for trend_n in [3,4]:
            for wick_min in [0.4,0.5]:
                sigs=test_strategy(c, lambda c,i,tn=trend_n,wm=wick_min: t_reversal_after_trend(c,i,tn,wm))
                if len(sigs)>=10:
                    w=sum(1 for x in sigs if x)
                    results.append({'s':f'REV{trend_n}_{int(wick_min*100)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # 9. Support/Resistance
        sigs=test_strategy(c, lambda c,i: t_support_resistance(c,i,20))
        if len(sigs)>=10:
            w=sum(1 for x in sigs if x)
            results.append({'s':'SR20','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # ── COMBINATION: WR + Trend confirmation ──
        for p in [7,10,14]:
            for os in [-90,-85,-80]:
                for trend_lb in [2,3]:
                    for trend_type in ['follow','boost']:
                        sigs=[]
                        for i in range(50,n-1):
                            d=t_wr(c,i,p,os,-20,False,0.35)
                            if d is None: continue
                            if trend_type=='follow':
                                td=t_trend_follow(c,i,trend_lb)
                            else:
                                td=t_trend_boost(c,i,trend_lb,0.6)
                            if td!=d: continue  # trend must agree with WR
                            nxt=c[i+1]
                            won=(d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1])
                            sigs.append(won)
                        if len(sigs)>=10:
                            w=sum(1 for x in sigs if x)
                            results.append({'s':f'W{abs(os)}P{p}+T{trend_lb}{trend_type[0]}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # ── COMBINATION: WR + Momentum ──
        for p in [7,10,14]:
            for os in [-90,-85,-80]:
                for mom_lb in [3,5]:
                    sigs=[]
                    for i in range(50,n-1):
                        d=t_wr(c,i,p,os,-20,False,0.35)
                        if d is None: continue
                        md=t_momentum(c,i,mom_lb,0.3)
                        if md!=d: continue
                        nxt=c[i+1]
                        won=(d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1])
                        sigs.append(won)
                    if len(sigs)>=10:
                        w=sum(1 for x in sigs if x)
                        results.append({'s':f'W{abs(os)}P{p}+M{mom_lb}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # ── COMBINATION: WR + Volatility Expansion ──
        for p in [7,10,14]:
            for os in [-90,-85,-80]:
                for mult in [1.3,1.5]:
                    sigs=[]
                    for i in range(50,n-1):
                        d=t_wr(c,i,p,os,-20,False,0.35)
                        if d is None: continue
                        vd=t_volatility_expansion(c,i,10,mult)
                        if vd!=d: continue
                        nxt=c[i+1]
                        won=(d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1])
                        sigs.append(won)
                    if len(sigs)>=10:
                        w=sum(1 for x in sigs if x)
                        results.append({'s':f'W{abs(os)}P{p}+V{int(mult*10)}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # ── COMBINATION: Trend + Momentum (both agree) ──
        for lb in [2,3]:
            for mom_lb in [3,5]:
                for thresh in [0.3,0.5]:
                    sigs=[]
                    for i in range(50,n-1):
                        d=t_trend_follow(c,i,lb)
                        if d is None: continue
                        md=t_momentum(c,i,mom_lb,thresh)
                        if md!=d: continue
                        nxt=c[i+1]
                        won=(d=='RISE' and nxt[4]>nxt[1]) or (d=='FALL' and nxt[4]<nxt[1])
                        sigs.append(won)
                    if len(sigs)>=10:
                        w=sum(1 for x in sigs if x)
                        results.append({'s':f'TF{lb}+M{mom_lb}_{thresh}','wr':round(w/len(sigs)*100,1),'t':len(sigs),'w':w})
        
        # ── REPORT ──
        results.sort(key=lambda x: -x['wr'])
        print(f"  Top [{time.time()-t0:.0f}s]:", flush=True)
        print(f"  {'Strat':<24} {'WR%':<8} {'T':<6} {'W':<6}", flush=True)
        print(f"  {'-'*46}", flush=True)
        for r in results[:30]:
            if r['t']>=15:
                print(f"  {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6} {r['w']:<6}", flush=True)
        
        for r in results: r['m']=m
        all_results.extend(results)
    
    # ── GLOBAL ──
    print(f"\n\n{'='*60}", flush=True)
    print(f"BEST PER MARKET (>=50 trades)", flush=True)
    print(f"{'='*60}", flush=True)
    print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}", flush=True)
    print("-"*50, flush=True)
    for m in MARKETS:
        mrs=[r for r in all_results if r['m']==m and r['t']>=50]
        mrs.sort(key=lambda x: -x['wr'])
        if mrs:
            r=mrs[0]
            print(f"{m:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}", flush=True)
    
    # Elite (>=75% WR)
    elite=[r for r in all_results if r['wr']>=75 and r['t']>=10]
    if elite:
        print(f"\n\n{'='*60}", flush=True)
        print(f"ELITE (>=75% WR, >=10 trades)", flush=True)
        print(f"{'='*60}", flush=True)
        print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}", flush=True)
        print("-"*50, flush=True)
        elite.sort(key=lambda x: -x['wr'])
        for r in elite[:15]:
            print(f"{r['m']:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}", flush=True)
    
    # Best with >=100 trades
    best100=[r for r in all_results if r['t']>=100]
    best100.sort(key=lambda x: -x['wr'])
    if best100:
        print(f"\n\n{'='*60}", flush=True)
        print(f"BEST WITH >=100 TRADES", flush=True)
        print(f"{'='*60}", flush=True)
        print(f"{'Market':<10} {'Strat':<24} {'WR%':<8} {'T':<6}", flush=True)
        print("-"*50, flush=True)
        seen=set()
        for r in best100[:20]:
            k=(r['m'],r['s'])
            if k not in seen:
                seen.add(k)
                print(f"{r['m']:<10} {r['s']:<24} {r['wr']:<8.1f} {r['t']:<6}", flush=True)
    
    with open(Path(r"C:\Users\b0231\Desktop\step master")/"backtest_results.json","w") as f:
        json.dump(all_results,f,indent=2)
    print(f"\nDone: {time.time()-t_start:.0f}s, {len(all_results)} results",flush=True)

if __name__=="__main__":
    main()
