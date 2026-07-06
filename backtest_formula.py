"""
Mathematical formula backtest for digit even/odd prediction.
No streaks, no counting rules — pure probability calculus.
"""
import csv, math, json, itertools
from pathlib import Path

CSV = Path(r"C:\Users\b0231\Downloads\1HZ75V_ticks.csv")
OUT = Path(r"C:\Users\b0231\Desktop\step master\formula_results.json")

prices = []
with open(CSV) as f:
    next(f)
    for line in f:
        prices.append(float(line.strip().split(",")[-1]))

n = len(prices)
digits = [int(f"{p:.2f}"[-1]) for p in prices]
pr = [0 if d%2==0 else 1 for d in digits]

results = []
def add(label, wins, total):
    if total >= 10:
        wr = round(wins/total*100, 1)
        results.append({"s":label,"wr":wr,"t":total,"w":wins,"l":total-wins})

# Precompute digit transition counts: P(next=even | curr_digit)
trans_e = [0]*10; trans_t = [0]*10
for i in range(1, n):
    d = digits[i-1]; trans_t[d] += 1
    if pr[i] == 0: trans_e[d] += 1
prob_e_given_d = [trans_e[d]/trans_t[d] if trans_t[d]>0 else 0.5 for d in range(10)]

# Precompute pair transition: P(next=even | last 2 digits)
pair_e = {}; pair_t = {}
for i in range(2, n):
    key = (digits[i-2], digits[i-1])
    pair_t[key] = pair_t.get(key,0) + 1
    if pr[i] == 0: pair_e[key] = pair_e.get(key,0) + 1
prob_e_given_pair = {k: pair_e[k]/pair_t[k] for k in pair_t if pair_t[k]>=10}

# ============================================================
# 1. EXPONENTIAL MOVING AVERAGE (continuous)
#    Treat parity as 0/1, compute EMA, convert to probability
# ============================================================
print("1. EMA probability...", flush=True)
for alpha in [0.01, 0.03, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5]:
    for th in [0.05, 0.08, 0.1, 0.12, 0.15]:
        wins_e = 0; trades_e = 0; wins_o = 0; trades_o = 0
        ema = 0.5
        for i in range(n):
            p = pr[i]
            ema = p * alpha + ema * (1 - alpha)
            if i >= 20:
                dev = ema - 0.5
                nxt_idx = i + 1
                if nxt_idx >= n: continue
                if dev > th:
                    trades_o += 1
                    if pr[nxt_idx] == 1: wins_o += 1
                elif dev < -th:
                    trades_e += 1
                    if pr[nxt_idx] == 0: wins_e += 1
        label = f"EMA_a{int(alpha*100)}_t{int(th*100)}"
        add(f"{label}_EV", wins_e, trades_e)
        add(f"{label}_OD", wins_o, trades_o)
        add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 2. BAYESIAN BETA-BERNOULLI
#    Beta(1,1) prior, update with observed parities
#    P(even) = (alpha + even_count) / (alpha+beta + N)
# ============================================================
print("2. Bayesian beta-Bernoulli...", flush=True)
for prior_a in [0.5, 1, 2, 5]:
    for prior_b in [0.5, 1, 2, 5]:
        for window in [5, 10, 20, 30, 50]:
            for th in [0.08, 0.1, 0.12, 0.15]:
                wins_e=0; trades_e=0; wins_o=0; trades_o=0
                for i in range(window, n):
                    w = pr[i-window:i]
                    ev = sum(1 for p in w if p==0); od = window - ev
                    post_p_even = (prior_a + ev) / (prior_a + prior_b + window)
                    dev = post_p_even - 0.5
                    nxt = pr[i]
                    if dev > th:
                        trades_e += 1
                        if nxt == 0: wins_e += 1
                    elif dev < -th:
                        trades_o += 1
                        if nxt == 1: wins_o += 1
                label = f"BAYES_w{window}_a{prior_a}b{prior_b}_t{int(th*100)}"
                add(f"{label}_EV", wins_e, trades_e)
                add(f"{label}_OD", wins_o, trades_o)
                add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 3. DIGIT TRANSITION PROBABILITY (continuous)
#    P(even | current digit) from observed transition matrix
#    Trade when probability deviates from 0.5 by threshold
# ============================================================
print("3. Digit transition probability...", flush=True)
for th in [0.03, 0.05, 0.08, 0.1]:
    wins_e=0; trades_e=0; wins_o=0; trades_o=0
    for i in range(1, n):
        d = digits[i-1]; p_even = prob_e_given_d[d]
        dev = p_even - 0.5
        if dev > th:
            trades_e += 1
            if pr[i] == 0: wins_e += 1
        elif dev < -th:
            trades_o += 1
            if pr[i] == 1: wins_o += 1
    label = f"DIGPROB_t{int(th*100)}"
    add(f"{label}_EV", wins_e, trades_e)
    add(f"{label}_OD", wins_o, trades_o)
    add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 4. LOGISTIC REGRESSION features:
#    f1 = EMA of parity (alpha=0.1)
#    f2 = recent proportion even (window=10)
#    f3 = digit_transition_prob[current_digit]
#    f4 = price_change_last_tick (direction: +1/-1)
#    f5 = volatility (tick-to-tick price change abs)
#    Combined as log-odds: sum(beta_i * f_i)
# ============================================================
print("4. Logistic regression (feature combinations)...", flush=True)

# Precompute features at each index
# Features computed from PAST data only (no lookahead)
ema10 = [0.5]*n
for i in range(1,n): ema10[i] = pr[i-1]*0.1 + ema10[i-1]*0.9
prop10 = [0.5]*n
for i in range(10,n): w=pr[i-10:i]; prop10[i]=sum(1 for p in w if p==0)/10
price_c = [0.0]*n
for i in range(2,n): price_c[i]=1 if prices[i-1]>prices[i-2] else -1
vol = [0.0]*n
for i in range(2,n): vol[i]=abs(prices[i-1]-prices[i-2])

# Standardize features
def zscore(arr):
    m=sum(arr)/len(arr); s=math.sqrt(sum((x-m)**2 for x in arr)/len(arr)) or 1
    return [(x-m)/s for x in arr]

z_ema = zscore(ema10)
z_prop = zscore(prop10)
z_dtp = [prob_e_given_d[d] for d in digits]
z_dtp = zscore(z_dtp)
z_pc = zscore(price_c)
z_vol = zscore(vol)

# Test various linear combinations
coeff_sets = [
    ([1,0,0,0,0], "EMAonly"),
    ([0,1,0,0,0], "PROP10"),
    ([0,0,1,0,0], "DIGPROB"),
    ([0,0,0,1,0], "DIRECTION"),
    ([1,0.5,0,0,0], "EMA+PROP"),
    ([1,0,0.5,0,0], "EMA+DIG"),
    ([0.5,1,0,0,0], "PROP+EMA"),
    ([1,1,1,0,0], "EMA+PROP+DIG"),
    ([1,1,1,0.5,0], "EMA+PROP+DIG+DIR"),
    ([1,1,1,0,0.3], "EMA+PROP+DIG+VOL"),
    ([1,2,1,0,0], "EMA+2PROP+DIG"),
    ([2,1,1,0,0], "2EMA+PROP+DIG"),
]

for coeffs, cname in coeff_sets:
    for th in [0.1, 0.2, 0.3, 0.5, 0.7, 1.0]:
        wins_e=0; trades_e=0; wins_o=0; trades_o=0
        for i in range(20, n):
            logit = (coeffs[0]*z_ema[i] + coeffs[1]*z_prop[i] +
                     coeffs[2]*z_dtp[i-1] + coeffs[3]*z_pc[i] +
                     coeffs[4]*z_vol[i])
            nxt = pr[i]
            if logit > th:
                trades_o += 1
                if nxt == 1: wins_o += 1
            elif logit < -th:
                trades_e += 1
                if nxt == 0: wins_e += 1
        label = f"LOGIT_{cname}_t{int(th*100)}"
        add(f"{label}_EV", wins_e, trades_e)
        add(f"{label}_OD", wins_o, trades_o)
        add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 5. KERNEL WEIGHTED AVERAGE
#    Gaussian kernel weighting of recent parities
# ============================================================
print("5. Kernel weighted average...", flush=True)
def gauss_kernel(x, mu, sigma):
    return math.exp(-0.5*((x-mu)/sigma)**2)

for sigma in [1,2,3,5,8]:
    for window in [10, 20]:
        for th in [0.08, 0.1, 0.12]:
            wins_e=0; trades_e=0; wins_o=0; trades_o=0
            for i in range(window, n):
                total_w=0; weighted=0
                for j in range(i-window, i):
                    w = gauss_kernel(j, i-1, sigma)
                    total_w += w
                    weighted += pr[j] * w
                if total_w == 0: continue
                avg = weighted / total_w
                dev = avg - 0.5
                nxt = pr[i]
                if dev > th:
                    trades_o += 1
                    if nxt == 1: wins_o += 1
                elif dev < -th:
                    trades_e += 1
                    if nxt == 0: wins_e += 1
            label = f"KERN_s{sigma}_w{window}_t{int(th*100)}"
            add(f"{label}_EV", wins_e, trades_e)
            add(f"{label}_OD", wins_o, trades_o)
            add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 6. POLYNOMIAL WEIGHTED AVERAGE
#    Weights = t^k for recent ticks (increasing emphasis)
# ============================================================
print("6. Polynomial weighted average...", flush=True)
for k in [0.5, 1, 2, 3]:
    for window in [8, 12, 20]:
        for th in [0.08, 0.1, 0.12]:
            wins_e=0; trades_e=0; wins_o=0; trades_o=0
            for i in range(window, n):
                total_w=0; weighted=0
                for j in range(window):
                    w = (j+1)**k
                    total_w += w
                    weighted += pr[i-window+j] * w
                if total_w == 0: continue
                avg = weighted / total_w
                dev = avg - 0.5
                nxt = pr[i]
                if dev > th:
                    trades_o += 1
                    if nxt == 1: wins_o += 1
                elif dev < -th:
                    trades_e += 1
                    if nxt == 0: wins_e += 1
            label = f"POLY_k{k}_w{window}_t{int(th*100)}"
            add(f"{label}_EV", wins_e, trades_e)
            add(f"{label}_OD", wins_o, trades_o)
            add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 7. ENTROPY-WEIGHTED
#    When entropy of recent distribution is low, trade
#    entropy = -sum(p*log(p)) for binary distribution
# ============================================================
print("7. Entropy-weighted...", flush=True)
def bin_entropy(p):
    if p<=0 or p>=1: return 0
    return -p*math.log2(p) - (1-p)*math.log2(1-p)

for window in [8, 12, 20]:
    for max_ent in [0.5, 0.6, 0.7, 0.8]:
        wins_e=0; trades_e=0; wins_o=0; trades_o=0
        for i in range(window, n):
            w = pr[i-window:i]
            p_even = sum(1 for p in w if p==0)/window
            ent = bin_entropy(p_even)
            if ent > max_ent:  # too random, skip
                continue
            nxt = pr[i]
            if p_even > 0.5:
                trades_e += 1
                if nxt == 0: wins_e += 1
            else:
                trades_o += 1
                if nxt == 1: wins_o += 1
        label = f"ENTROPY_w{window}_me{int(max_ent*100)}"
        add(f"{label}_EV", wins_e, trades_e)
        add(f"{label}_OD", wins_o, trades_o)
        add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 8. KALMAN FILTER (1D)
#    State: true parity probability, observe 0/1
#    Predict step: state stays same (+ noise)
#    Update step: blend observation with prediction
# ============================================================
print("8. Kalman filter...", flush=True)
for R in [0.1, 0.2, 0.5, 1.0]:  # measurement noise
    for Q in [0.01, 0.05, 0.1]:  # process noise
        for th in [0.08, 0.1, 0.12]:
            x = 0.5; P = 1.0  # state estimate, error covariance
            wins_e=0; trades_e=0; wins_o=0; trades_o=0
            for i in range(1, n):
                # Predict: use state from ticks 0..i-1 to predict tick i
                x_pred = x; P_pred = P + Q
                if i >= 20:
                    dev = x_pred - 0.5
                    nxt = pr[i]
                    if dev > th:
                        trades_o += 1
                        if nxt == 1: wins_o += 1
                    elif dev < -th:
                        trades_e += 1
                        if nxt == 0: wins_e += 1
                # Update: incorporate pr[i] for future predictions
                K = P_pred / (P_pred + R)  # Kalman gain
                x = x_pred + K * (pr[i] - x_pred)
                P = (1 - K) * P_pred
            label = f"KALMAN_R{int(R*100)}_Q{int(Q*100)}_t{int(th*100)}"
            add(f"{label}_EV", wins_e, trades_e)
            add(f"{label}_OD", wins_o, trades_o)
            add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# 9. WEIGHTED MA with TRIANGULAR weights
# ============================================================
print("9. Triangular weighted MA...", flush=True)
for window in [6, 8, 10, 12, 15, 20]:
    for th in [0.08, 0.1, 0.12]:
        wins_e=0; trades_e=0; wins_o=0; trades_o=0
        for i in range(window, n):
            total_w = window*(window+1)//2
            weighted = 0
            for j in range(window):
                w = j+1 if j < window//2 else window-j
                weighted += pr[i-window+j] * w
            avg = weighted / (window*window//4 if window%2==0 else (window+1)*(window+1)//4)
            # Actually compute proper triangular sum
            mid = (window+1)//2
            tri_w = [(j+1) if j < mid else (window-j) for j in range(window)]
            total_tw = sum(tri_w)
            weighted2 = sum(pr[i-window+j]*tri_w[j] for j in range(window))
            avg2 = weighted2 / total_tw
            dev = avg2 - 0.5
            nxt = pr[i]
            if dev > th:
                trades_o += 1
                if nxt == 1: wins_o += 1
            elif dev < -th:
                trades_e += 1
                if nxt == 0: wins_e += 1
        label = f"TRI_w{window}_t{int(th*100)}"
        add(f"{label}_EV", wins_e, trades_e)
        add(f"{label}_OD", wins_o, trades_o)
        add(label, wins_e+wins_o, trades_e+trades_o)

# ============================================================
# Sort & output
# ============================================================
results.sort(key=lambda x: -x["wr"])

print(f"\n{'='*80}", flush=True)
print(f"TOTAL FORMULA RESULTS: {len(results)}", flush=True)
print(f"{'='*80}", flush=True)

print(f"\nTOP 50 (>=10 trades):", flush=True)
print(f"{'Formula':<32} {'WR%':<8} {'T':<8} {'W':<8}", flush=True)
print(f"{'-'*56}", flush=True)
for r in results[:50]:
    print(f"{r['s']:<32} {r['wr']:<8.1f} {r['t']:<8} {r['w']:<8}", flush=True)

best50 = [r for r in results if r["t"] >= 50]
best50.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=50 TRADES:", flush=True)
print(f"{'Formula':<32} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-'*48}", flush=True)
for r in best50[:30]:
    print(f"{r['s']:<32} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

best100 = [r for r in results if r["t"] >= 100]
best100.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=100 TRADES:", flush=True)
print(f"{'Formula':<32} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-'*48}", flush=True)
for r in best100[:20]:
    print(f"{r['s']:<32} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

# Find the best single formula (combined EV+OD)
best_combined = [r for r in results if "_EV" not in r["s"] and "_OD" not in r["s"]]
best_combined.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST COMBINED FORMULAS (>=50 trades):", flush=True)
print(f"{'Formula':<32} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-'*48}", flush=True)
for r in best_combined:
    if r["t"] >= 50:
        print(f"{r['s']:<32} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

# Save
output = {"symbol":"1HZ75V","total_ticks":n,"total_results":len(results),
          "best_results":best100[:50],"all_results":results}
with open(OUT,"w") as f: json.dump(output,f,indent=2)
print(f"\nSaved to {OUT}", flush=True)
