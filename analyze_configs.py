import json
from collections import defaultdict

with open(r'C:\Users\b0231\Desktop\step master\backtest_results.json') as f:
    data = json.load(f)

# Group by (market, strategy, min_conf), find best rev_penalty
groups = defaultdict(list)
for r in data:
    key = (r['market'], r['strategy'], r['min_conf'])
    groups[key].append(r)

print("=" * 80)
print("CONFIDENCE THRESHOLD EFFECT (best per market/strategy/min_conf)")
print("=" * 80)
print()

markets = ['R_10','R_25','R_50','R_75','R_100','1HZ10V','1HZ25V','1HZ50V','1HZ75V','1HZ100V']
strategies = ['MACDX','RSIX','EXH','ENG','SRE','RB','HAM','FKT','CEX','BBX']

for m in markets:
    print(f"\n{m}:")
    print(f"  {'Strat':<8} {'WR@MC0':<10} {'WR@MC65':<10} {'WR@MC70':<10} {'WR@MC75':<10} {'WR@MC80':<10}")
    print(f"  {'-'*50}")
    for s in strategies:
        row = []
        for mc in [0, 65, 70, 75, 80]:
            key = (m, s, mc)
            if key in groups:
                best = max(groups[key], key=lambda x: x['win_rate'])
                wt = best['win_rate']
                tr = best['trades']
                row.append(f"{wt}%({tr})")
            else:
                row.append("---")
        print(f"  {s:<8} {row[0]:<10} {row[1]:<10} {row[2]:<10} {row[3]:<10} {row[4]:<10}")

# Find the cross-market optimal configs
print("\n\n" + "=" * 80)
print("BEST CONFIG PER STRATEGY (aggregated across all markets)")
print("=" * 80)
for s in strategies:
    sdata = [r for r in data if r['strategy'] == s and r['trades'] >= 20]
    if not sdata: continue
    # group by (min_conf, rev_penalty)
    configs = defaultdict(lambda: {'wins':0,'total':0,'count':0})
    for r in sdata:
        key = (r['min_conf'], r['rev_penalty'])
        w = r['win_rate'] * r['trades'] / 100
        configs[key]['wins'] += w
        configs[key]['total'] += r['trades']
        configs[key]['count'] += 1
    best_cfg = max(configs.items(), key=lambda x: x[1]['wins']/x[1]['total'] if x[1]['total'] > 0 else 0)
    (mc, rp), stats = best_cfg
    avg_wr = round(stats['wins'] / stats['total'] * 100, 1) if stats['total'] > 0 else 0
    print(f"  {s:<8} best: min_conf={mc:<3} rev_penalty={rp:<3} => {avg_wr}% across {stats['total']} trades ({stats['count']} mkts)")

print("\n\n" + "=" * 80)
print("CONSENSUS BACKTEST: multiple strategies firing on same candle")
print("=" * 80)
# Re-run: count how many candles would have 2+ strategies agreeing
import csv, math
from pathlib import Path

CSV_DIR = Path(r"C:\Users\b0231\Downloads")

# Load strategy signal functions quickly
def closes(c): return [x["close"] for x in c]
def sma(arr,p): return None if len(arr)<p else sum(arr[-p:])/p
def stddev(arr,p):
    m=sma(arr,p)
    if m is None: return None
    return math.sqrt(sum((x-m)**2 for x in arr[-p:])/p)
def rsi(arr):
    if len(arr)<15: return None
    g=l=0
    for i in range(len(arr)-14,len(arr)):
        d=arr[i]-arr[i-1]
        if d>0: g+=d
        else: l-=d
    ag,al=g/14,l/14
    return 100 if al==0 else 100-100/(1+ag/al)
def ema(arr,p):
    if len(arr)<p: return None
    k=2/(p+1); e=sum(arr[:p])/p
    for i in range(p,len(arr)): e=arr[i]*k+e*(1-k)
    return e

# Core consensus: for each market, check what % of signals have 2+ strategies agreeing
consensus_results = []
for m in markets:
    path = CSV_DIR / f"{m}_15s.csv"
    if not path.exists(): continue
    candles = []
    with open(path) as f:
        for row in csv.DictReader(f):
            candles.append({"time":int(row["time_unix"]),"open":float(row["open"]),"high":float(row["high"]),"low":float(row["low"]),"close":float(row["close"])})
    n = len(candles)
    
    # Precompute RSI
    rsi_vals = [None]*n
    for i in range(14,n):
        arr = closes(candles[:i+1])
        g=l=0
        for j in range(len(arr)-14,len(arr)):
            d=arr[j]-arr[j-1]
            if d>0: g+=d
            else: l-=d
        ag,al=g/14,l/14
        rsi_vals[i] = 100 if al==0 else 100-100/(1+ag/al)
    
    macd_vals = [None]*n
    k12=2/13; k26=2/27
    for i in range(25,n):
        arr = closes(candles[:i+1])
        f=sum(arr[:12])/12; s=sum(arr[:26])/26
        for j in range(12,i+1): f=arr[j]*k12+f*(1-k12)
        for j in range(26,i+1): s=arr[j]*k26+s*(1-k26)
        macd_vals[i] = f-s
    
    cons_wins = 0; cons_losses = 0; cons_total = 0
    single_wins = 0; single_losses = 0; single_total = 0
    
    for idx in range(39, n-1):
        cw = candles[:idx+1]
        cl = closes(cw)
        nxt = candles[idx+1]
        
        sigs = []  # (action, conf)
        r = None
        # Check each strategy
        if idx >= 16 and rsi_vals[idx] is not None and rsi_vals[idx-1] is not None:
            r=rsi_vals[idx]; rP=rsi_vals[idx-1]; l=cw[-1]; p=cw[-2]
            if rP<=25 and r>rP and p["close"]<p["open"] and l["close"]>l["open"] and l["close"]>p["close"]: sigs.append(("RISE",min(96,70+(25-rP)*1.6)))
            if rP>=75 and r<rP and p["close"]>p["open"] and l["close"]<l["open"] and l["close"]<p["close"]: sigs.append(("FALL",min(96,70+(rP-75)*1.6)))
        if idx >= 21:
            m=sma(cl,20); sd=stddev(cl,20)
            if m is not None and sd:
                u=m+2.5*sd; lw=m-2.5*sd; l=cw[-1]; p=cw[-2]
                if p["low"]<=lw and l["close"]>lw and l["close"]>l["open"] and l["close"]>p["close"]: sigs.append(("RISE",min(95,72+((lw-p["low"])/sd)*15)))
                if p["high"]>=u and l["close"]<u and l["close"]<l["open"] and l["close"]<p["close"]: sigs.append(("FALL",min(95,72+((p["high"]-u)/sd)*15)))
        if idx >= 6:
            a=cw[-2]; b=cw[-1]; aB=abs(a["close"]-a["open"]); bB=abs(b["close"]-b["open"])
            if aB>0 and bB>=aB*1.6:
                dn=cw[-5]["close"]>cw[-2]["close"] and cw[-4]["close"]>cw[-3]["close"]
                up=cw[-5]["close"]<cw[-2]["close"] and cw[-4]["close"]<cw[-3]["close"]
                if dn and a["close"]<a["open"] and b["close"]>b["open"] and b["close"]>=a["open"] and b["open"]<=a["close"]: sigs.append(("RISE",min(94,70+(bB/aB)*10)))
                if up and a["close"]>a["open"] and b["close"]<b["open"] and b["close"]<=a["open"] and b["open"]>=a["close"]: sigs.append(("FALL",min(94,70+(bB/aB)*10)))
        if idx >= 39 and macd_vals[idx] is not None:
            m=macd_vals[idx]; mP=macd_vals[idx-1]
            srs=[x for x in macd_vals[:idx+1] if x is not None]
            if len(srs)>=11:
                k9=2/10; sig=sum(srs[-9:])/9; sigP=sum(srs[-10:-1])/9
                hN=m-sig; hP=mP-sigP
                if hP<0 and hN>0 and m>mP: sigs.append(("RISE",min(92,72+abs(hN-hP)*3000)))
                if hP>0 and hN<0 and m<mP: sigs.append(("FALL",min(92,72+abs(hN-hP)*3000)))
        if idx >= 15:
            l=cw[-1]; p=cw[-2]; lb=cw[-13:-2]; sL=min(x["low"] for x in lb); sH=max(x["high"] for x in lb); pR=p["high"]-p["low"]
            if pR>0:
                if p["low"]<sL and p["close"]>sL and l["close"]>sL and l["close"]>p["close"]:
                    w=(min(p["open"],p["close"])-p["low"])/pR
                    if w>=0.40: sigs.append(("RISE",min(97,80+w*25)))
                if p["high"]>sH and p["close"]<sH and l["close"]<sH and l["close"]<p["close"]:
                    w=(p["high"]-max(p["open"],p["close"]))/pR
                    if w>=0.40: sigs.append(("FALL",min(97,80+w*25)))
        if idx >= 4:
            a=cw[-3]; b=cw[-2]; l=cw[-1]
            if a["high"]>b["high"] and a["low"]<b["low"]:
                iH=min(a["high"],b["high"]); iL=max(a["low"],b["low"])
                if l["close"]>iH and l["close"]>l["open"] and l["high"]>iH: sigs.append(("RISE",85))
                if l["close"]<iL and l["close"]<l["open"] and l["low"]<iL: sigs.append(("FALL",85))
        if idx >= 7:
            l=cw[-1]; rng=l["high"]-l["low"]
            if rng>0:
                body=abs(l["close"]-l["open"]); lw=min(l["open"],l["close"])-l["low"]; uw=l["high"]-max(l["open"],l["close"])
                sL=min(x["low"] for x in cw[-6:-1]); sH=max(x["high"] for x in cw[-6:-1])
                if lw>body*2 and lw/rng>=0.6 and body/rng<=0.35 and l["low"]<=sL and l["close"]>l["open"]: sigs.append(("RISE",min(94,75+lw/rng*25)))
                if uw>body*2 and uw/rng>=0.6 and body/rng<=0.35 and l["high"]>=sH and l["close"]<l["open"]: sigs.append(("FALL",min(94,75+uw/rng*25)))
        if idx >= 5:
            a,b,d,l=cw[-4],cw[-3],cw[-2],cw[-1]; r1=a["high"]-a["low"]; r2=b["high"]-b["low"]; r3=d["high"]-d["low"]
            if r3<r2 and r2<r1 and r1>0:
                if a["close"]>a["open"] and b["close"]>b["open"] and d["close"]>d["open"] and l["close"]<l["open"]: sigs.append(("FALL",82))
                if a["close"]<a["open"] and b["close"]<b["open"] and d["close"]<d["open"] and l["close"]>l["open"]: sigs.append(("RISE",82))
        if idx >= 17 and rsi_vals[idx] is not None:
            r=rsi_vals[idx]; l=cw[-1]
            u3=l["close"]>cw[-2]["close"] and cw[-2]["close"]>cw[-3]["close"] and cw[-3]["close"]>cw[-4]["close"]
            d3=l["close"]<cw[-2]["close"] and cw[-2]["close"]<cw[-3]["close"] and cw[-3]["close"]<cw[-4]["close"]
            if u3 and r>=70: sigs.append(("FALL",min(95,78+(r-70)*0.8)))
            if d3 and r<=30: sigs.append(("RISE",min(95,78+(30-r)*0.8)))
        if idx >= 21:
            l=cw[-1]; h20=max(x["high"] for x in cw[-21:-1]); l20=min(x["low"] for x in cw[-21:-1]); rng=h20-l20
            if rng>0:
                p=(l["close"]-l20)/rng
                if p<=0.10 and l["close"]>l["open"] and l["close"]>cw[-2]["close"]: sigs.append(("RISE",min(92,72+(0.10-p)*100)))
                if p>=0.90 and l["close"]<l["open"] and l["close"]<cw[-2]["close"]: sigs.append(("FALL",min(92,72+(p-0.90)*100)))
        
        # Filter by confidence >= 70
        sigs70 = [s for s in sigs if s[1] >= 70]
        
        # Consensus check
        rise = [s for s in sigs70 if s[0]=='RISE']
        fall = [s for s in sigs70 if s[0]=='FALL']
        action = None
        if len(rise) >= 2 and len(rise) > len(fall): action = 'RISE'
        elif len(fall) >= 2 and len(fall) > len(rise): action = 'FALL'
        
        if action:
            won = (action=='RISE' and nxt["close"]>nxt["open"]) or (action=='FALL' and nxt["close"]<nxt["open"])
            if won: cons_wins+=1
            else: cons_losses+=1
            cons_total+=1
        elif len(sigs70) == 1:
            won = (sigs70[0][0]=='RISE' and nxt["close"]>nxt["open"]) or (sigs70[0][0]=='FALL' and nxt["close"]<nxt["open"])
            if won: single_wins+=1
            else: single_losses+=1
            single_total+=1
    
    cons_wr = round(cons_wins/cons_total*100,1) if cons_total>0 else 0
    single_wr = round(single_wins/single_total*100,1) if single_total>0 else 0
    print(f"  {m:<10} Consensus>=2: {cons_total:<4} signals @ {cons_wr}% | Single: {single_total:<4} signals @ {single_wr}%")
