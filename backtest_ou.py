"""
Mathematical formula backtest for digit Over/Under prediction.
Filter: only trigger on boundary digits 4,5,6 where crossing is possible.
Over = digits {5,6,7,8,9}, Under = digits {0,1,2,3,4}
No streaks, no counting rules — pure probability calculus.

Standard: at tick i, check boundary(digit[i]), predict ou[i+1].
"""
import csv, math, json
from pathlib import Path

CSV = Path(r"C:\Users\b0231\Downloads\1HZ75V_ticks.csv")
OUT = Path(r"C:\Users\b0231\Desktop\step master\ou_results.json")

prices = []
with open(CSV) as f:
    next(f)
    for line in f:
        prices.append(float(line.strip().split(",")[-1]))

n = len(prices)
digits = [int(f"{p:.2f}"[-1]) for p in prices]
ou = [0 if d <= 4 else 1 for d in digits]

boundary = {4, 5, 6}
def is_boundary(d):
    return d in boundary

results = []
def add(label, wins, total):
    if total >= 10:
        wr = round(wins/total*100, 1)
        results.append({"s": label, "wr": wr, "t": total, "w": wins, "l": total - wins})

# Precompute global digit transition: P(next=over | curr_digit)
trans_o = [0] * 10
trans_t = [0] * 10
for i in range(n - 1):
    d = digits[i]
    trans_t[d] += 1
    if ou[i + 1] == 1:
        trans_o[d] += 1
prob_o_given_d = [trans_o[d] / trans_t[d] if trans_t[d] > 0 else 0.5 for d in range(10)]

# Precompute features at each index (using only past data)
ema10 = [0.5] * n
for i in range(1, n):
    ema10[i] = ou[i - 1] * 0.1 + ema10[i - 1] * 0.9

prop10 = [0.5] * n
for i in range(10, n):
    w = ou[i - 10:i]
    prop10[i] = sum(1 for p in w if p == 1) / 10

price_c = [0.0] * n
for i in range(2, n):
    price_c[i] = 1 if prices[i - 1] > prices[i - 2] else -1

vol = [0.0] * n
for i in range(2, n):
    vol[i] = abs(prices[i - 1] - prices[i - 2])

def zscore(arr):
    m = sum(arr) / len(arr)
    s = math.sqrt(sum((x - m) ** 2 for x in arr) / len(arr)) or 1
    return [(x - m) / s for x in arr]

z_ema = zscore(ema10)
z_prop = zscore(prop10)
z_dtp = zscore([prob_o_given_d[d] for d in digits])
z_pc = zscore(price_c)
z_vol = zscore(vol)

WARMUP = 20

# ============================================================
# 1. EXPONENTIAL MOVING AVERAGE
#    EMA of ou (0/1), trade when deviates from 0.5
# ============================================================
print("1. EMA probability...", flush=True)
for alpha in [0.01, 0.03, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5]:
    for th in [0.05, 0.08, 0.1, 0.12, 0.15]:
        wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
        ema = 0.5
        for i in range(n - 1):
            ema = ou[i] * alpha + ema * (1 - alpha)
            if i >= WARMUP and is_boundary(digits[i]):
                dev = ema - 0.5
                nxt = ou[i + 1]
                if dev > th:
                    trades_o += 1
                    if nxt == 1: wins_o += 1
                elif dev < -th:
                    trades_u += 1
                    if nxt == 0: wins_u += 1
        label = f"OU_EMA_a{int(alpha*100)}_t{int(th*100)}"
        add(f"{label}_UN", wins_u, trades_u)
        add(f"{label}_OV", wins_o, trades_o)
        add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 2. BAYESIAN BETA-BERNOULLI
#    Beta(a,b) prior, update with window of past ou, predict next
# ============================================================
print("2. Bayesian beta-Bernoulli...", flush=True)
for prior_a in [0.5, 1, 2, 5]:
    for prior_b in [0.5, 1, 2, 5]:
        for window in [5, 10, 20, 30, 50]:
            for th in [0.08, 0.1, 0.12, 0.15]:
                wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
                for i in range(window, n - 1):
                    if not is_boundary(digits[i]):
                        continue
                    w = ou[i - window + 1:i + 1]
                    ov = sum(1 for p in w if p == 1)
                    post = (prior_a + ov) / (prior_a + prior_b + window)
                    dev = post - 0.5
                    nxt = ou[i + 1]
                    if dev > th:
                        trades_o += 1
                        if nxt == 1: wins_o += 1
                    elif dev < -th:
                        trades_u += 1
                        if nxt == 0: wins_u += 1
                label = f"OU_BAYES_w{window}_a{prior_a}b{prior_b}_t{int(th*100)}"
                add(f"{label}_UN", wins_u, trades_u)
                add(f"{label}_OV", wins_o, trades_o)
                add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 3. DIGIT TRANSITION PROBABILITY
#    P(next=over | current_digit) from global transition matrix
# ============================================================
print("3. Digit transition probability...", flush=True)
for th in [0.03, 0.05, 0.08, 0.1]:
    wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
    for i in range(n - 1):
        if not is_boundary(digits[i]):
            continue
        p_over = prob_o_given_d[digits[i]]
        dev = p_over - 0.5
        nxt = ou[i + 1]
        if dev > th:
            trades_o += 1
            if nxt == 1: wins_o += 1
        elif dev < -th:
            trades_u += 1
            if nxt == 0: wins_u += 1
    label = f"OU_DIGPROB_t{int(th*100)}"
    add(f"{label}_UN", wins_u, trades_u)
    add(f"{label}_OV", wins_o, trades_o)
    add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 4. LOGISTIC REGRESSION features
#    f1=EMA(0.1), f2=prop10, f3=digit_transition_prob, f4=direction, f5=vol
# ============================================================
print("4. Logistic regression (feature combinations)...", flush=True)
coeff_sets = [
    ([1, 0, 0, 0, 0], "EMAonly"),
    ([0, 1, 0, 0, 0], "PROP10"),
    ([0, 0, 1, 0, 0], "DIGPROB"),
    ([0, 0, 0, 1, 0], "DIRECTION"),
    ([1, 0.5, 0, 0, 0], "EMA+PROP"),
    ([1, 0, 0.5, 0, 0], "EMA+DIG"),
    ([0.5, 1, 0, 0, 0], "PROP+EMA"),
    ([1, 1, 1, 0, 0], "EMA+PROP+DIG"),
    ([1, 1, 1, 0.5, 0], "EMA+PROP+DIG+DIR"),
    ([1, 1, 1, 0, 0.3], "EMA+PROP+DIG+VOL"),
    ([1, 2, 1, 0, 0], "EMA+2PROP+DIG"),
    ([2, 1, 1, 0, 0], "2EMA+PROP+DIG"),
]

for coeffs, cname in coeff_sets:
    for th in [0.1, 0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0]:
        wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
        for i in range(WARMUP, n - 1):
            if not is_boundary(digits[i]):
                continue
            logit = (coeffs[0] * z_ema[i] + coeffs[1] * z_prop[i] +
                     coeffs[2] * z_dtp[i] + coeffs[3] * z_pc[i] +
                     coeffs[4] * z_vol[i])
            nxt = ou[i + 1]
            if logit > th:
                trades_o += 1
                if nxt == 1: wins_o += 1
            elif logit < -th:
                trades_u += 1
                if nxt == 0: wins_u += 1
        label = f"OU_LOGIT_{cname}_t{int(th*100)}"
        add(f"{label}_UN", wins_u, trades_u)
        add(f"{label}_OV", wins_o, trades_o)
        add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 5. KERNEL WEIGHTED AVERAGE (Gaussian)
# ============================================================
print("5. Kernel weighted average...", flush=True)
def gauss_kernel(x, mu, sigma):
    return math.exp(-0.5 * ((x - mu) / sigma) ** 2)

for sigma in [1, 2, 3, 5, 8]:
    for window in [10, 20]:
        for th in [0.08, 0.1, 0.12]:
            wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
            for i in range(window, n - 1):
                if not is_boundary(digits[i]):
                    continue
                total_w = 0; weighted = 0
                for j in range(i - window + 1, i + 1):
                    w = gauss_kernel(j, i, sigma)
                    total_w += w
                    weighted += ou[j] * w
                if total_w == 0: continue
                avg = weighted / total_w
                dev = avg - 0.5
                nxt = ou[i + 1]
                if dev > th:
                    trades_o += 1
                    if nxt == 1: wins_o += 1
                elif dev < -th:
                    trades_u += 1
                    if nxt == 0: wins_u += 1
            label = f"OU_KERN_s{sigma}_w{window}_t{int(th*100)}"
            add(f"{label}_UN", wins_u, trades_u)
            add(f"{label}_OV", wins_o, trades_o)
            add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 6. POLYNOMIAL WEIGHTED AVERAGE
# ============================================================
print("6. Polynomial weighted average...", flush=True)
for k in [0.5, 1, 2, 3]:
    for window in [8, 12, 20]:
        for th in [0.08, 0.1, 0.12]:
            wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
            for i in range(window, n - 1):
                if not is_boundary(digits[i]):
                    continue
                total_w = 0; weighted = 0
                for j in range(window):
                    w = (j + 1) ** k
                    total_w += w
                    weighted += ou[i - window + 1 + j] * w
                if total_w == 0: continue
                avg = weighted / total_w
                dev = avg - 0.5
                nxt = ou[i + 1]
                if dev > th:
                    trades_o += 1
                    if nxt == 1: wins_o += 1
                elif dev < -th:
                    trades_u += 1
                    if nxt == 0: wins_u += 1
            label = f"OU_POLY_k{k}_w{window}_t{int(th*100)}"
            add(f"{label}_UN", wins_u, trades_u)
            add(f"{label}_OV", wins_o, trades_o)
            add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 7. ENTROPY-WEIGHTED
#    Trade only when recent distribution is non-random (low entropy)
# ============================================================
print("7. Entropy-weighted...", flush=True)
def bin_entropy(p):
    if p <= 0 or p >= 1:
        return 0
    return -p * math.log2(p) - (1 - p) * math.log2(1 - p)

for window in [8, 12, 20]:
    for max_ent in [0.5, 0.6, 0.7, 0.8]:
        wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
        for i in range(window, n - 1):
            if not is_boundary(digits[i]):
                continue
            w = ou[i - window + 1:i + 1]
            p_over = sum(1 for p in w if p == 1) / window
            ent = bin_entropy(p_over)
            if ent > max_ent:
                continue
            nxt = ou[i + 1]
            if p_over > 0.5:
                trades_o += 1
                if nxt == 1: wins_o += 1
            else:
                trades_u += 1
                if nxt == 0: wins_u += 1
        label = f"OU_ENTROPY_w{window}_me{int(max_ent*100)}"
        add(f"{label}_UN", wins_u, trades_u)
        add(f"{label}_OV", wins_o, trades_o)
        add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 8. KALMAN FILTER (1D)
#    Predict before update, use state from tick 0..i to predict i+1
# ============================================================
print("8. Kalman filter...", flush=True)
for R in [0.1, 0.2, 0.5, 1.0]:
    for Q in [0.01, 0.05, 0.1]:
        for th in [0.08, 0.1, 0.12]:
            x = 0.5; P = 1.0
            wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
            for i in range(n - 1):
                x_pred = x
                P_pred = P + Q
                if i >= WARMUP and is_boundary(digits[i]):
                    dev = x_pred - 0.5
                    nxt = ou[i + 1]
                    if dev > th:
                        trades_o += 1
                        if nxt == 1: wins_o += 1
                    elif dev < -th:
                        trades_u += 1
                        if nxt == 0: wins_u += 1
                K = P_pred / (P_pred + R)
                x = x_pred + K * (ou[i] - x_pred)
                P = (1 - K) * P_pred
            label = f"OU_KALMAN_R{int(R*100)}_Q{int(Q*100)}_t{int(th*100)}"
            add(f"{label}_UN", wins_u, trades_u)
            add(f"{label}_OV", wins_o, trades_o)
            add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# 9. TRIANGULAR WEIGHTED MA
# ============================================================
print("9. Triangular weighted MA...", flush=True)
for window in [6, 8, 10, 12, 15, 20]:
    for th in [0.08, 0.1, 0.12]:
        wins_u = 0; trades_u = 0; wins_o = 0; trades_o = 0
        for i in range(window, n - 1):
            if not is_boundary(digits[i]):
                continue
            mid = (window + 1) // 2
            tri_w = [(j + 1) if j < mid else (window - j) for j in range(window)]
            total_tw = sum(tri_w)
            weighted = sum(ou[i - window + 1 + j] * tri_w[j] for j in range(window))
            avg = weighted / total_tw
            dev = avg - 0.5
            nxt = ou[i + 1]
            if dev > th:
                trades_o += 1
                if nxt == 1: wins_o += 1
            elif dev < -th:
                trades_u += 1
                if nxt == 0: wins_u += 1
        label = f"OU_TRI_w{window}_t{int(th*100)}"
        add(f"{label}_UN", wins_u, trades_u)
        add(f"{label}_OV", wins_o, trades_o)
        add(label, wins_u + wins_o, trades_u + trades_o)

# ============================================================
# Sort & output
# ============================================================
results.sort(key=lambda x: -x["wr"])

print(f"\n{'=' * 80}", flush=True)
print(f"TOTAL OU FORMULA RESULTS: {len(results)}", flush=True)
print(f"{'=' * 80}", flush=True)

print(f"\nTOP 50 (>=10 trades):", flush=True)
print(f"{'Formula':<36} {'WR%':<8} {'T':<8} {'W':<8}", flush=True)
print(f"{'-' * 60}", flush=True)
for r in results[:50]:
    print(f"{r['s']:<36} {r['wr']:<8.1f} {r['t']:<8} {r['w']:<8}", flush=True)

best50 = [r for r in results if r["t"] >= 50]
best50.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=50 TRADES:", flush=True)
print(f"{'Formula':<36} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-' * 52}", flush=True)
for r in best50[:30]:
    print(f"{r['s']:<36} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

best100 = [r for r in results if r["t"] >= 100]
best100.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=100 TRADES:", flush=True)
print(f"{'Formula':<36} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-' * 52}", flush=True)
for r in best100[:20]:
    print(f"{r['s']:<36} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

best_combined = [r for r in results if "_UN" not in r["s"] and "_OV" not in r["s"]]
best_combined.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST COMBINED FORMULAS (>=50 trades):", flush=True)
print(f"{'Formula':<36} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-' * 52}", flush=True)
for r in best_combined:
    if r["t"] >= 50:
        print(f"{r['s']:<36} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

output = {"symbol": "1HZ75V", "total_ticks": n, "total_results": len(results),
          "best_results": best100[:50], "all_results": results}
with open(OUT, "w") as f:
    json.dump(output, f, indent=2)
print(f"\nSaved to {OUT}", flush=True)
