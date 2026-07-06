"""
Tick-level even/odd digit backtest for 1HZ75V.
Tests all possible window/lookback/pattern combinations to derive optimal formula.
Digit extraction matches bot.html: (price.toFixed(2)).slice(-1)|0
"""
import csv, json, math, itertools, time
from pathlib import Path

CSV = Path(r"C:\Users\b0231\Downloads\1HZ75V_ticks.csv")
OUT = Path(r"C:\Users\b0231\Desktop\step master\digit_backtest_results.json")

def digit(price):
    s = f"{price:.2f}"
    return int(s[-1])

def parity(d): return 0 if d%2==0 else 1  # 0=even, 1=odd

print("Loading tick data...", flush=True)
prices = []
with open(CSV) as f:
    next(f)
    for line in f:
        prices.append(float(line.strip().split(",")[-1]))
print(f"Loaded {len(prices)} ticks", flush=True)

digits = [digit(p) for p in prices]
parities = [parity(d) for d in digits]

results = []

def add_result(label, wins, total):
    if total >= 10:
        wr = round(wins/total*100, 1)
        results.append({"s":label,"wr":wr,"t":total,"w":wins,"l":total-wins})

def run_strategy(pred_fn, label, min_window=2):
    n = len(prices)
    wins = 0
    trades = 0
    for i in range(min_window, n):
        pred = pred_fn(i)
        if pred is None:
            continue
        trades += 1
        actual = parities[i]
        if pred == actual:
            wins += 1
    add_result(label, wins, trades)

# ============================================================
# 1. Current Digit -> Next Parity (10 values, 2 directions each)
# ============================================================
print("1. Current digit -> next parity...", flush=True)
for d in range(10):
    for th in range(50, 100, 5):
        label = f"CD_{d}_EV_{th}"
        cnt = 0
        wins = 0
        for i in range(1, len(prices)):
            if parities[i-1] == 0 and digits[i-1] == d:
                cnt += 1
                if parities[i] == 0:
                    wins += 1
        if cnt >= 20 and cnt > 0:
            wr = wins/cnt*100
            if wr >= th:
                add_result(label, wins, cnt)

for d in range(10):
    for th in range(50, 100, 5):
        label = f"CD_{d}_OD_{th}"
        cnt = 0
        wins = 0
        for i in range(1, len(prices)):
            if parities[i-1] == 1 and digits[i-1] == d:
                cnt += 1
                if parities[i] == 1:
                    wins += 1
        if cnt >= 20 and cnt > 0:
            wr = wins/cnt*100
            if wr >= th:
                add_result(label, wins, cnt)

# ============================================================
# 2. Current Parity -> Next Parity (persistence/reversal)
# ============================================================
print("2. Current parity -> next parity...", flush=True)
for cur_p, pname in [(0,"EV"),(1,"OD")]:
    cnt = 0; wins = 0
    for i in range(1, len(prices)):
        if parities[i-1] == cur_p:
            cnt += 1
            if parities[i] == cur_p: wins += 1
    if cnt > 0:
        add_result(f"PERSIST_{pname}", wins, cnt)
        add_result(f"REV_{pname}", cnt-wins, cnt)

# ============================================================
# 3. Majority Rule (last N ticks)
# ============================================================
print("3. Majority rule...", flush=True)
for N in range(2, 11):
    for th in range(50, 95, 5):
        for direction in ["EV","OD"]:
            target = 0 if direction == "EV" else 1
            label = f"MAJ{N}_{direction}_{th}"
            wins = 0; trades = 0
            for i in range(N, len(prices)):
                window = parities[i-N:i]
                cnt_target = sum(1 for p in window if p == target)
                pct = cnt_target / N * 100
                if pct >= th:
                    trades += 1
                    if parities[i] == target:
                        wins += 1
            add_result(label, wins, trades)

# ============================================================
# 4. Unanimous Streak (all last N same parity)
# ============================================================
print("4. Unanimous streak...", flush=True)
for N in range(2, 7):
    for direction in ["EV","OD"]:
        target = 0 if direction == "EV" else 1
        label = f"UNA_{N}_{direction}"
        wins = 0; trades = 0
        for i in range(N, len(prices)):
            window = parities[i-N:i]
            if all(p == target for p in window):
                trades += 1
                if parities[i] == target:
                    wins += 1
        add_result(label, wins, trades)
        # Reversion: if unanimous, bet opposite
        label_rev = f"UNA_{N}_{direction}_REV"
        wins_r = trades - wins
        add_result(label_rev, wins_r, trades)

# ============================================================
# 5. Weighted Average (linear weights)
# ============================================================
print("5. Weighted average...", flush=True)
for N in range(3, 11):
    for th in range(50, 90, 5):
        for direction in ["EV","OD"]:
            target = 0 if direction == "EV" else 1
            label = f"WAVG{N}_{direction}_{th}"
            wins = 0; trades = 0
            for i in range(N, len(prices)):
                window = parities[i-N:i]
                total_w = N*(N+1)/2
                weighted = 0
                for j, p in enumerate(window):
                    w = j + 1
                    weighted += (p == target) * w
                pct = weighted / total_w * 100
                if pct >= th:
                    trades += 1
                    if parities[i] == target:
                        wins += 1
            add_result(label, wins, trades)

# ============================================================
# 6. Transition Matrix (last 2 parities)
# ============================================================
print("6. 2-parity transition matrix...", flush=True)
for p0 in [0,1]:
    for p1 in [0,1]:
        pname = f"{'E' if p0==0 else 'D'}{'E' if p1==0 else 'D'}"
        cnt_even = 0; cnt_odd = 0
        for i in range(2, len(prices)):
            if parities[i-2] == p0 and parities[i-1] == p1:
                if parities[i] == 0: cnt_even += 1
                else: cnt_odd += 1
        total = cnt_even + cnt_odd
        if total >= 20:
            add_result(f"TP_{pname}_EV", cnt_even, total)
            add_result(f"TP_{pname}_OD", cnt_odd, total)

# ============================================================
# 7. Transition Matrix (last 3 parities)
# ============================================================
print("7. 3-parity transition matrix...", flush=True)
for triplet in itertools.product([0,1], repeat=3):
    pname = "".join("E" if p==0 else "D" for p in triplet)
    cnt_even = 0; cnt_odd = 0
    for i in range(3, len(prices)):
        if parities[i-3] == triplet[0] and parities[i-2] == triplet[1] and parities[i-1] == triplet[2]:
            if parities[i] == 0: cnt_even += 1
            else: cnt_odd += 1
    total = cnt_even + cnt_odd
    if total >= 15:
        add_result(f"TP3_{pname}_EV", cnt_even, total)
        add_result(f"TP3_{pname}_OD", cnt_odd, total)

# ============================================================
# 8. Majority with diff margin
# ============================================================
print("8. Majority with margin...", flush=True)
for N in range(3, 11):
    for margin in range(1, N):
        label = f"MM{N}_{margin}"
        wins=0; trades=0
        for i in range(N, len(prices)):
            window = parities[i-N:i]
            ev_cnt = sum(1 for p in window if p == 0)
            od_cnt = N - ev_cnt
            diff = abs(ev_cnt - od_cnt)
            if diff >= margin:
                pred = 0 if ev_cnt > od_cnt else 1
                trades += 1
                if parities[i] == pred:
                    wins += 1
        add_result(label, wins, trades)

# ============================================================
# 9. Price Direction + Parity
# ============================================================
print("9. Price direction + parity...", flush=True)
dict_parity = {0: "EV", 1: "OD"}
for direction in ["UP","DN"]:
    cnt_even = 0; cnt_odd = 0
    for i in range(1, len(prices)):
        up = prices[i-1] < prices[i-2] if i >= 2 else False
        dn = prices[i-1] > prices[i-2] if i >= 2 else False
        if direction == "UP" and up:
            if parities[i] == 0: cnt_even += 1
            else: cnt_odd += 1
        elif direction == "DN" and dn:
            if parities[i] == 0: cnt_even += 1
            else: cnt_odd += 1
    total = cnt_even + cnt_odd
    if total >= 20:
        add_result(f"DIR_{direction}_EV", cnt_even, total)
        add_result(f"DIR_{direction}_OD", cnt_odd, total)

# ============================================================
# 10. Combined: Transition + Majority filter
# ============================================================
print("10. Combined strategies...", flush=True)
for N in [2,3,4]:
    for th in [55,60,65]:
        for direction in ["EV","OD"]:
            target = 0 if direction == "EV" else 1
            label = f"COMB_TP{N}_{direction}_{th}"
            wins = 0; trades = 0
            for i in range(N+1, len(prices)):
                hist = parities[i-N-1:i-1]
                last_n = parities[i-N:i]
                cnt_t = sum(1 for p in hist if p == target)
                pct = cnt_t / (N+1) * 100
                if pct < th: continue
                cnt_m = sum(1 for p in last_n if p == target)
                if cnt_m > (N / 2):
                    trades += 1
                    if parities[i] == target:
                        wins += 1
            add_result(label, wins, trades)

# ============================================================
# 11. Best single-digit model with majority confirmation
# ============================================================
print("11. Digit-specific + majority confirm...", flush=True)
for d in range(10):
    cnt_even = 0; cnt_odd = 0
    for i in range(1, len(prices)):
        if digits[i-1] == d:
            if parities[i] == 0: cnt_even += 1
            else: cnt_odd += 1
    total = cnt_even + cnt_odd
    if total >= 20:
        ev_wr = cnt_even/total*100
        od_wr = cnt_odd/total*100
        if ev_wr >= 55:
            for N in [3,4,5]:
                for th in [55,60]:
                    label = f"DIG_{d}_EV_MAJ{N}_{th}"
                    wins=0; trades=0
                    for i in range(max(1,N), len(prices)):
                        if digits[i-1] != d: continue
                        window = parities[i-N:i]
                        cnt_ev = sum(1 for p in window if p == 0)
                        if cnt_ev/N*100 >= th:
                            trades += 1
                            if parities[i] == 0: wins += 1
                    add_result(label, wins, trades)
        if od_wr >= 55:
            for N in [3,4,5]:
                for th in [55,60]:
                    label = f"DIG_{d}_OD_MAJ{N}_{th}"
                    wins=0; trades=0
                    for i in range(max(1,N), len(prices)):
                        if digits[i-1] != d: continue
                        window = parities[i-N:i]
                        cnt_od = sum(1 for p in window if p == 1)
                        if cnt_od/N*100 >= th:
                            trades += 1
                            if parities[i] == 1: wins += 1
                    add_result(label, wins, trades)

# ============================================================
# 12. Exponential moving average of parity
# ============================================================
print("12. EMA parity...", flush=True)
for alpha in [0.1, 0.2, 0.3, 0.5, 0.7]:
    for th in [55, 60, 65, 70]:
        for direction in ["EV","OD"]:
            target = 0 if direction == "EV" else 1
            label = f"EMA_{int(alpha*100)}_{direction}_{th}"
            wins=0; trades=0
            ema_val = 0.5
            for i in range(len(prices)):
                p = 1 if parities[i] == target else 0
                ema_val = p * alpha + ema_val * (1 - alpha)
                if i >= 10:
                    pct = ema_val * 100
                    if pct >= th:
                        trades += 1
                        nxt = i + 1
                        if nxt < len(prices):
                            actual = 1 if parities[nxt] == target else 0
                            if actual: wins += 1
            add_result(label, wins, trades)

# ============================================================
# Sort and output
# ============================================================
results.sort(key=lambda x: -x["wr"])

print(f"\n{'='*80}", flush=True)
print(f"TOTAL RESULTS: {len(results)}", flush=True)
print(f"{'='*80}", flush=True)

# Top 50 overall
print(f"\nTOP 50 (>=10 trades):", flush=True)
print(f"{'Strat':<28} {'WR%':<8} {'T':<8} {'W':<8} {'L':<8}", flush=True)
print(f"{'-'*60}", flush=True)
for r in results[:50]:
    print(f"{r['s']:<28} {r['wr']:<8.1f} {r['t']:<8} {r['w']:<8} {r['l']:<8}", flush=True)

# Top with >=50 trades
best50 = [r for r in results if r["t"] >= 50]
best50.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=50 TRADES:", flush=True)
print(f"{'Strat':<28} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-'*44}", flush=True)
for r in best50[:30]:
    print(f"{r['s']:<28} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

# Top with >=100 trades
best100 = [r for r in results if r["t"] >= 100]
best100.sort(key=lambda x: -x["wr"])
print(f"\n\nBEST WITH >=100 TRADES:", flush=True)
print(f"{'Strat':<28} {'WR%':<8} {'T':<8}", flush=True)
print(f"{'-'*44}", flush=True)
for r in best100[:20]:
    print(f"{r['s']:<28} {r['wr']:<8.1f} {r['t']:<8}", flush=True)

# ============================================================
# Find optimal formula for bot.html
# ============================================================
print(f"\n{'='*80}", flush=True)
print(f"OPTIMAL FORMULA FOR BOT INTEGRATION", flush=True)
print(f"{'='*80}", flush=True)

# Pick best strategy >= 50 trades
if best50:
    best = best50[0]
    print(f"\nBest strategy: {best['s']}", flush=True)
    print(f"  WR: {best['wr']}% ({best['w']}/{best['t']})", flush=True)

# Decode the best strategy into JS formula
def decode_label(label):
    # Compact format: name+number_direction_threshold
    # e.g. MAJ8_OD_90, MM8_7, UNA_5_EV, TP_EE_EV, CD_0_EV_60
    def try_int(s):
        try: return int(s)
        except: return None
    parts = label.split("_")
    # Strategy names that have suffix numbers: MAJ, WAVG, UNA, MM, DIG, EMA, COMB
    raw = parts[0]
    # Extract base name vs numeric suffix
    base = raw.rstrip("0123456789")
    num = try_int(raw[len(base):]) if base != raw else None
    if base == "MAJ" and num and len(parts) >= 3:
        dir_=parts[1]; th=try_int(parts[2])
        return f"Majority last {num} -> {dir_} (>{th}%)"
    if base == "WAVG" and num and len(parts) >= 3:
        dir_=parts[1]; th=try_int(parts[2])
        return f"Weighted avg last {num} -> {dir_} (>{th}%)"
    if base == "UNA" and num and len(parts) >= 2:
        dir_=parts[1]
        rev = len(parts)>=3 and parts[2]=="REV"
        return f"All last {num} = {dir_}{' (REV)' if rev else ''}"
    if base == "MM" and num and len(parts) >= 2:
        m = try_int(parts[1])
        return f"Majority margin {num}/{m}"
    if base == "EMA" and num and len(parts) >= 3:
        dir_=parts[1]; th=try_int(parts[2])
        return f"EMA parity alpha=0.{num} -> {dir_} (>{th}%)"
    if base == "COMB" and num and len(parts) >= 3:
        dir_=parts[1]; th=try_int(parts[2])
        return f"Combined TP+Maj {num} -> {dir_} (>{th}%)"
    if base == "DIG" and num and len(parts) >= 5:
        dir_=parts[1]; n=try_int(parts[3]); th=try_int(parts[4])
        return f"Digit {num} -> {dir_} + Maj{n} (>{th}%)"
    if raw == "PERSIST" and len(parts)>=2:
        return f"Parity persistence: {parts[1]}→same"
    if raw == "REV" and len(parts)>=2:
        return f"Parity reversal: {parts[1]}→opposite"
    if raw == "TP" and len(parts)>=3:
        return f"2-parity: {parts[1]}→{parts[2]}"
    if raw == "TP3" and len(parts)>=3:
        return f"3-parity: {parts[1]}→{parts[2]}"
    if raw == "DIR" and len(parts)>=3:
        return f"Direction {parts[1]}→{parts[2]}"
    return label

print(f"\nInterpretation: {decode_label(best['s'])}", flush=True)

# Generate JS formula for bot.html
def try_int(s):
    try: return int(s)
    except: return None

def generate_js_formula(best_result, all_best50):
    label = best_result['s']
    parts = label.split("_")
    raw = parts[0]
    base = raw.rstrip("0123456789")
    num = try_int(raw[len(base):]) if base != raw else None

    js = "// Auto-generated optimal digit strategy from backtest on 1HZ75V\n"
    js += f"// Best: {label} @ {best_result['wr']}% WR ({best_result['w']}/{best_result['t']})\n\n"

    if base == "MAJ" and num is not None:
        direction = parts[1]
        th = try_int(parts[2])
        target_parity = 0 if direction == "EV" else 1
        js += f"const OPTIMAL_N = {num};\n"
        js += f"const OPTIMAL_TH = {th};\n"
        js += f"const OPTIMAL_EO_TARGET = {target_parity}; // 0=even, 1=odd\n\n"
        js += "function optimalDigitSignal(hist){\n"
        js += "  if(hist.length < OPTIMAL_N) return null;\n"
        js += "  const window = hist.slice(-OPTIMAL_N);\n"
        js += "  let cnt = 0;\n"
        js += "  for(const d of window) if(d % 2 === OPTIMAL_EO_TARGET) cnt++;\n"
        js += "  const pct = cnt / OPTIMAL_N * 100;\n"
        js += "  if(pct >= OPTIMAL_TH) return OPTIMAL_EO_TARGET === 0 ? 'EVEN' : 'ODD';\n"
        js += "  return null;\n"
        js += "}\n"

    elif base == "UNA" and num is not None:
        direction = parts[1]
        rev = len(parts) >= 3 and parts[2] == "REV"
        target_parity = 0 if direction == "EV" else 1
        if rev: target_parity = 1 - target_parity
        js += f"const OPTIMAL_UNA_N = {num};\n"
        js += f"const OPTIMAL_EO_TARGET = {target_parity};\n\n"
        js += "function optimalDigitSignal(hist){\n"
        js += "  if(hist.length < OPTIMAL_UNA_N) return null;\n"
        js += "  const window = hist.slice(-OPTIMAL_UNA_N);\n"
        js += "  const first = window[0] % 2;\n"
        js += "  for(const d of window) if(d % 2 !== first) return null;\n"
        js += "  return OPTIMAL_EO_TARGET === 0 ? 'EVEN' : 'ODD';\n"
        js += "}\n"

    elif base == "MM" and num is not None:
        m = try_int(parts[1])
        js += f"const OPTIMAL_MM_N = {num};\n"
        js += f"const OPTIMAL_MM_MARGIN = {m};\n\n"
        js += "function optimalDigitSignal(hist){\n"
        js += "  if(hist.length < OPTIMAL_MM_N) return null;\n"
        js += "  const window = hist.slice(-OPTIMAL_MM_N);\n"
        js += "  let ev = 0;\n"
        js += "  for(const d of window) if(d % 2 === 0) ev++;\n"
        js += "  const od = OPTIMAL_MM_N - ev;\n"
        js += "  const diff = Math.abs(ev - od);\n"
        js += "  if(diff < OPTIMAL_MM_MARGIN) return null;\n"
        js += "  return ev > od ? 'EVEN' : 'ODD';\n"
        js += "}\n"

    elif base == "WAVG" and num is not None:
        direction = parts[1]
        th = try_int(parts[2])
        target_parity = 0 if direction == "EV" else 1
        js += f"const OPTIMAL_WAVG_N = {num};\n"
        js += f"const OPTIMAL_WAVG_TH = {th};\n"
        js += f"const OPTIMAL_EO_TARGET = {target_parity};\n\n"
        js += "function optimalDigitSignal(hist){\n"
        js += "  if(hist.length < OPTIMAL_WAVG_N) return null;\n"
        js += "  const window = hist.slice(-OPTIMAL_WAVG_N);\n"
        js += "  let weighted = 0, totalW = 0;\n"
        js += "  for(let j=0; j<window.length; j++){\n"
        js += "    const w = j + 1;\n"
        js += "    totalW += w;\n"
        js += "    if(window[j] % 2 === OPTIMAL_EO_TARGET) weighted += w;\n"
        js += "  }\n"
        js += "  if(weighted / totalW * 100 >= OPTIMAL_WAVG_TH) return OPTIMAL_EO_TARGET === 0 ? 'EVEN' : 'ODD';\n"
        js += "  return null;\n"
        js += "}\n"

    else:
        js += decode_best_as_generic(best_result, all_best50)

    return js

def decode_best_as_generic(best, all_best50):
    label = best['s']
    desc = decode_label(label)
    return f"// Optimal strategy: {label}\n// {desc}\n// WR: {best['wr']}%, Trades: {best['t']}\n// Consider implementing one of the known strategy types above.\n"

# Top 5 strategies for comparison
print(f"\nTop 5 strategies for injection:", flush=True)
for r in best50[:5]:
    print(f"  {r['s']:<28} {r['wr']:<8.1f}% {r['t']:<8} trades ({decode_label(r['s'])})", flush=True)

# Generate JS for best strategy
js_formula = generate_js_formula(best50[0], best50)
print(f"\nGenerated JS formula:\n{js_formula}", flush=True)

# Also generate multi-strategy ensemble formula
print(f"\n\nEnsemble formula (top 3 strategies):", flush=True)
top3 = best50[:3]
ensemble_js = "// Ensemble: vote among top strategies\n"
for i, r in enumerate(top3):
    label = r['s']
    parts = label.split("_")
    name = parts[0]
    desc = decode_label(label)
    ensemble_js += f"// [{i+1}] {label}: {desc} @ {r['wr']}%\n"
print(ensemble_js, flush=True)

# Save full results
output = {
    "symbol": "1HZ75V",
    "total_ticks": len(prices),
    "total_results": len(results),
    "base_rate_even": sum(1 for p in parities if p==0)/len(parities)*100,
    "best_results": best50[:50],
    "all_results": results,
    "optimal_strategy": best50[0] if best50 else None,
    "generated_js": js_formula
}

with open(OUT, "w") as f:
    json.dump(output, f, indent=2)

print(f"\n\nResults saved to {OUT}", flush=True)
