import csv, json, math, time
from pathlib import Path
from collections import defaultdict

CSV_DIR = Path(r"C:\Users\b0231\Downloads")
MARKETS = ["R_10","R_25","R_50","R_75","R_100","1HZ10V","1HZ25V","1HZ50V","1HZ75V","1HZ100V"]

def load_csv(path):
    rows = []
    with open(path) as f:
        for row in csv.DictReader(f):
            rows.append({"time":int(row["time_unix"]),"open":float(row["open"]),"high":float(row["high"]),"low":float(row["low"]),"close":float(row["close"]),"ticks":int(row["ticks"])})
    return rows

def closes(c): return [x["close"] for x in c]

# Precomputed indicators for efficiency
def precompute_indicators(candles):
    n = len(candles)
    cl = closes(candles)
    rsi_vals = [None]*n
    for i in range(14,n):
        arr = cl[:i+1]
        g=l=0
        for j in range(len(arr)-14,len(arr)):
            d=arr[j]-arr[j-1]
            if d>0: g+=d
            else: l-=d
        ag,al=g/14,l/14
        rsi_vals[i] = 100 if al==0 else 100-100/(1+ag/al)
    # Precompute MACD for all candles (incremental)
    macd_vals = [None]*n
    k12=2/13; k26=2/27
    for i in range(25,n):
        arr = cl[:i+1]
        f=sum(arr[:12])/12; s=sum(arr[:26])/26
        for j in range(12,i+1): f=arr[j]*k12+f*(1-k12)
        for j in range(26,i+1): s=arr[j]*k26+s*(1-k26)
        macd_vals[i] = f-s
    trends = ["FLAT"]*n
    for i in range(4,n):
        c4 = candles[i-3:i+1]
        tp = ((c4[-1]["close"]-c4[0]["close"])/c4[0]["close"])*100
        trends[i] = "UP" if tp>0.05 else "DOWN" if tp<-0.05 else "FLAT"
    return rsi_vals, macd_vals, trends

# All 10 strategies
def sig_RSIX(c, idx, rsi_vals):
    if idx<16 or rsi_vals[idx] is None or rsi_vals[idx-1] is None: return None
    r=rsi_vals[idx]; rP=rsi_vals[idx-1]; l=c[-1]; p=c[-2]
    if rP<=25 and r>rP and p["close"]<p["open"] and l["close"]>l["open"] and l["close"]>p["close"]: return ("RISE",min(96,70+(25-rP)*1.6))
    if rP>=75 and r<rP and p["close"]>p["open"] and l["close"]<l["open"] and l["close"]<p["close"]: return ("FALL",min(96,70+(rP-75)*1.6))
    return None

def sig_BBX(c, idx):
    if idx<21: return None
    cl=closes(c); m=sum(cl[-20:])/20
    sd=math.sqrt(sum((x-m)**2 for x in cl[-20:])/20)
    if not sd: return None
    u=m+2.5*sd; lw=m-2.5*sd; l=c[-1]; p=c[-2]
    if p["low"]<=lw and l["close"]>lw and l["close"]>l["open"] and l["close"]>p["close"]: return ("RISE",min(95,72+((lw-p["low"])/sd)*15))
    if p["high"]>=u and l["close"]<u and l["close"]<l["open"] and l["close"]<p["close"]: return ("FALL",min(95,72+((p["high"]-u)/sd)*15))
    return None

def sig_ENG(c):
    if len(c)<7: return None
    a=c[-2]; b=c[-1]; aB=abs(a["close"]-a["open"]); bB=abs(b["close"]-b["open"])
    if aB==0 or bB<aB*1.6: return None
    dn=c[-5]["close"]>c[-2]["close"] and c[-4]["close"]>c[-3]["close"]
    up=c[-5]["close"]<c[-2]["close"] and c[-4]["close"]<c[-3]["close"]
    if dn and a["close"]<a["open"] and b["close"]>b["open"] and b["close"]>=a["open"] and b["open"]<=a["close"]: return ("RISE",min(94,70+(bB/aB)*10))
    if up and a["close"]>a["open"] and b["close"]<b["open"] and b["close"]<=a["open"] and b["open"]>=a["close"]: return ("FALL",min(94,70+(bB/aB)*10))
    return None

def sig_MACDX(c, macd_cache, idx):
    if idx<39 or idx>=len(macd_cache) or macd_cache[idx] is None: return None
    m=macd_cache[idx]; mP=macd_cache[idx-1]
    # signal line EMA(9) — use cached if available
    # compute on the fly
    def ema9(arr):
        k=2/10; e=sum(arr[:9])/9
        for i in range(9,len(arr)): e=arr[i]*k+e*(1-k)
        return e
    series=[x for x in macd_cache[:idx+1] if x is not None]
    if len(series)<11: return None
    sig=ema9(series); sigP=ema9(series[:-1])
    if sig is None or sigP is None: return None
    hN=m-sig; hP=mP-sigP
    if hP<0 and hN>0 and m>mP: return ("RISE",min(92,72+abs(hN-hP)*3000))
    if hP>0 and hN<0 and m<mP: return ("FALL",min(92,72+abs(hN-hP)*3000))
    return None

def sig_FKT(c):
    if len(c)<16: return None
    l=c[-1]; p=c[-2]; lb=c[-13:-2]
    sL=min(x["low"] for x in lb); sH=max(x["high"] for x in lb); pR=p["high"]-p["low"]
    if pR==0: return None
    if p["low"]<sL and p["close"]>sL and l["close"]>sL and l["close"]>p["close"]:
        w=(min(p["open"],p["close"])-p["low"])/pR
        if w>=0.40: return ("RISE",min(97,80+w*25))
    if p["high"]>sH and p["close"]<sH and l["close"]<sH and l["close"]<p["close"]:
        w=(p["high"]-max(p["open"],p["close"]))/pR
        if w>=0.40: return ("FALL",min(97,80+w*25))
    return None

def sig_CEX(c):
    if len(c)<5: return None
    a=c[-3]; b=c[-2]; l=c[-1]
    if not (a["high"]>b["high"] and a["low"]<b["low"]): return None
    iH=min(a["high"],b["high"]); iL=max(a["low"],b["low"])
    if l["close"]>iH and l["close"]>l["open"] and l["high"]>iH: return ("RISE",85)
    if l["close"]<iL and l["close"]<l["open"] and l["low"]<iL: return ("FALL",85)
    return None

def sig_HAM(c):
    if len(c)<8: return None
    l=c[-1]; rng=l["high"]-l["low"]
    if rng==0: return None
    body=abs(l["close"]-l["open"]); lw=min(l["open"],l["close"])-l["low"]; uw=l["high"]-max(l["open"],l["close"])
    sL=min(x["low"] for x in c[-6:-1]); sH=max(x["high"] for x in c[-6:-1])
    if lw>body*2 and lw/rng>=0.6 and body/rng<=0.35 and l["low"]<=sL and l["close"]>l["open"]: return ("RISE",min(94,75+lw/rng*25))
    if uw>body*2 and uw/rng>=0.6 and body/rng<=0.35 and l["high"]>=sH and l["close"]<l["open"]: return ("FALL",min(94,75+uw/rng*25))
    return None

def sig_EXH(c):
    if len(c)<6: return None
    a,b,d,l=c[-4],c[-3],c[-2],c[-1]; r1=a["high"]-a["low"]; r2=b["high"]-b["low"]; r3=d["high"]-d["low"]
    if r3<r2 and r2<r1 and r1>0:
        if a["close"]>a["open"] and b["close"]>b["open"] and d["close"]>d["open"] and l["close"]<l["open"]: return ("FALL",82)
        if a["close"]<a["open"] and b["close"]<b["open"] and d["close"]<d["open"] and l["close"]>l["open"]: return ("RISE",82)
    return None

def sig_SRE(c, idx, rsi_vals):
    if idx<17 or rsi_vals[idx] is None: return None
    r=rsi_vals[idx]; l=c[-1]
    u3=l["close"]>c[-2]["close"] and c[-2]["close"]>c[-3]["close"] and c[-3]["close"]>c[-4]["close"]
    d3=l["close"]<c[-2]["close"] and c[-2]["close"]<c[-3]["close"] and c[-3]["close"]<c[-4]["close"]
    if u3 and r>=70: return ("FALL",min(95,78+(r-70)*0.8))
    if d3 and r<=30: return ("RISE",min(95,78+(30-r)*0.8))
    return None

def sig_RB(c):
    if len(c)<22: return None
    l=c[-1]; h20=max(x["high"] for x in c[-21:-1]); l20=min(x["low"] for x in c[-21:-1]); rng=h20-l20
    if rng==0: return None
    p=(l["close"]-l20)/rng
    if p<=0.10 and l["close"]>l["open"] and l["close"]>c[-2]["close"]: return ("RISE",min(92,72+(0.10-p)*100))
    if p>=0.90 and l["close"]<l["open"] and l["close"]<c[-2]["close"]: return ("FALL",min(92,72+(p-0.90)*100))
    return None

FNS = [sig_RSIX,sig_BBX,sig_ENG,sig_MACDX,sig_FKT,sig_CEX,sig_HAM,sig_EXH,sig_SRE,sig_RB]
CODES = ["RSIX","BBX","ENG","MACDX","FKT","CEX","HAM","EXH","SRE","RB"]

def main():
    t_start = time.time()
    all_results = []
    
    for mi,m in enumerate(MARKETS):
        path = CSV_DIR / f"{m}_15s.csv"
        if not path.exists():
            print(f"SKIP {m}", flush=True); continue
        candles = load_csv(path)
        t0 = time.time()
        print(f"\n[{mi+1}/10] {m}: {len(candles)} candles", flush=True)
        n = len(candles)
        
        rsi_vals, macd_vals, trends = precompute_indicators(candles)
        
        sigs = []  # (code_idx, conf, won, trend)
        for idx in range(n-1):
            if idx+1 >= n: break
            cw = candles[:idx+1]
            nxt = candles[idx+1]
            
            r = sig_RSIX(cw, idx, rsi_vals)
            if r: sigs.append((0,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_BBX(cw, idx)
            if r: sigs.append((1,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_ENG(cw)
            if r: sigs.append((2,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_MACDX(cw, macd_vals, idx)
            if r: sigs.append((3,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_FKT(cw)
            if r: sigs.append((4,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_CEX(cw)
            if r: sigs.append((5,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_HAM(cw)
            if r: sigs.append((6,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_EXH(cw)
            if r: sigs.append((7,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_SRE(cw, idx, rsi_vals)
            if r: sigs.append((8,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
            
            r = sig_RB(cw)
            if r: sigs.append((9,r[1],(r[0]=="RISE" and nxt["close"]>nxt["open"]) or (r[0]=="FALL" and nxt["close"]<nxt["open"]),trends[idx]))
        
        print(f"  Signals: {len(sigs)} [{time.time()-t0:.0f}s]", flush=True)
        if not sigs: continue
        
        # Evaluate config combos: min_conf x rev_penalty
        MCS = [0,50,55,60,63,65,67,70,72,75,80]
        RPS = [0,5,8,10,12,15]
        
        strat_best = {}
        for mc in MCS:
            for rp in RPS:
                sw = [0]*10; sl = [0]*10
                for ci,conf,won,tr in sigs:
                    if mc>0 and conf<mc: continue
                    if rp>0:
                        # rev_penalty: reduce conf for trend-following
                        pass  # simplified: we apply min_conf only for now
                    if won: sw[ci]+=1
                    else: sl[ci]+=1
                for ci in range(10):
                    t=sw[ci]+sl[ci]
                    if t>=10:
                        wr=round(sw[ci]/t*100,1)
                        if ci not in strat_best or wr>strat_best[ci][0]:
                            strat_best[ci]=(wr,mc,t)
        
        print(f"  {'Code':<8} {'WR%':<8} {'Trades':<8} {'MinC':<6} {'Rate%':<8}")
        print(f"  {'-'*45}")
        for ci in range(10):
            if ci not in strat_best: continue
            wr,mc,t = strat_best[ci]
            rate = round(t/n*100,1)
            print(f"  {CODES[ci]:<8} {wr:<8.1f} {t:<8} {mc:<6} {rate:<8}", flush=True)
        print(f"  [{time.time()-t0:.0f}s]", flush=True)
        
        # Collect ALL configs for later analysis
        for mc in MCS:
            for rp in RPS:
                sw = [0]*10; sl = [0]*10
                for ci,conf,won,tr in sigs:
                    if mc>0 and conf<mc: continue
                    if tr=="UP" and CODES[ci] in ("RSIX","BBX","ENG") and False: pass
                    if won: sw[ci]+=1
                    else: sl[ci]+=1
                for ci in range(10):
                    t=sw[ci]+sl[ci]
                    if t>=10:
                        wr=round(sw[ci]/t*100,1)
                        all_results.append({"market":m,"strategy":CODES[ci],"win_rate":wr,"trades":t,"min_conf":mc,"rev_penalty":rp,"signal_rate":round(t/n*100,1)})
    
    print(f"\n\n{'='*60}", flush=True)
    print(f"TOP 50 (>=30 trades, sorted by WR) — {time.time()-t_start:.0f}s", flush=True)
    print(f"{'='*60}", flush=True)
    print(f"{'Market':<10} {'Strat':<8} {'WR%':<8} {'Trades':<8} {'MinC':<6} {'RevP':<6} {'Rate%':<8}")
    print("-"*55)
    top = [r for r in all_results if r["trades"]>=30]
    top.sort(key=lambda x: -x["win_rate"])
    for r in top[:50]:
        print(f"{r['market']:<10} {r['strategy']:<8} {r['win_rate']:<8.1f} {r['trades']:<8} {r['min_conf']:<6} {r['rev_penalty']:<6} {r['signal_rate']:<8}", flush=True)
    with open(r"C:\Users\b0231\Desktop\step master\backtest_results.json","w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n{len(all_results)} results saved", flush=True)

if __name__=="__main__":
    main()
