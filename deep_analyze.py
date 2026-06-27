"""Efficient deep analysis — pre-compute indicators, then test patterns."""
import csv, math
from collections import defaultdict

FILES = {
    'R_10':  r'C:\Users\b0231\Downloads\R_10_15s.csv',
    'R_25':  r'C:\Users\b0231\Downloads\R_25_15s.csv',
    'R_50':  r'C:\Users\b0231\Downloads\R_50_15s.csv',
    'R_75':  r'C:\Users\b0231\Downloads\R_75_15s.csv',
    'R_100': r'C:\Users\b0231\Downloads\R_100_15s.csv',
    '1HZ10V':  r'C:\Users\b0231\Downloads\1HZ10V_15s.csv',
    '1HZ25V':  r'C:\Users\b0231\Downloads\1HZ25V_15s.csv',
    '1HZ50V':  r'C:\Users\b0231\Downloads\1HZ50V_15s.csv',
    '1HZ75V':  r'C:\Users\b0231\Downloads\1HZ75V_15s.csv',
    '1HZ100V': r'C:\Users\b0231\Downloads\1HZ100V_15s.csv',
}

def load(path):
    rows = []
    with open(path) as f:
        for r in csv.DictReader(f):
            rows.append({
                'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
                'c':float(r['close']),'t':int(r['time_unix'])
            })
    return rows

def precompute(rows):
    n = len(rows)
    cl = [r['c'] for r in rows]
    hi = [r['h'] for r in rows]
    lo = [r['l'] for r in rows]
    
    # SMA 20
    sma20 = [None]*n
    for i in range(19, n):
        sma20[i] = sum(cl[i-19:i+1]) / 20
    
    # StdDev 20
    sd20 = [None]*n
    for i in range(19, n):
        m = sma20[i]
        sd20[i] = math.sqrt(sum((cl[j]-m)**2 for j in range(i-19,i+1)) / 20)
    
    # RSI 14
    rsi14 = [None]*n
    for i in range(14, n):
        gains = losses = 0
        for j in range(i-13, i+1):
            d = cl[j] - cl[j-1]
            if d > 0: gains += d
            else: losses -= d
        avg_g = gains / 14
        avg_l = losses / 14
        if avg_l == 0: rsi14[i] = 100
        else: rsi14[i] = 100 - (100 / (1 + avg_g/avg_l))
    
    # CCI 14
    cci14 = [None]*n
    for i in range(13, n):
        tp = [(hi[j]+lo[j]+cl[j])/3 for j in range(i-13,i+1)]
        m = sum(tp)/14
        md = sum(abs(t-m) for t in tp)/14
        cci14[i] = (tp[-1]-m)/(0.015*md) if md else 0
    
    # ATR 14
    atr14 = [None]*n
    for i in range(14, n):
        tr = [max(hi[j]-lo[j], abs(hi[j]-cl[j-1]), abs(lo[j]-cl[j-1])) for j in range(i-13,i+1)]
        atr14[i] = sum(tr)/14
    
    # EMA 12, 26
    def calc_ema(arr, period):
        ema = [None]*n
        k = 2/(period+1)
        ema[period-1] = sum(arr[:period])/period
        for i in range(period, n):
            ema[i] = arr[i]*k + ema[i-1]*(1-k)
        return ema
    
    ema12 = calc_ema(cl, 12)
    ema26 = calc_ema(cl, 26)
    macd_line = [None]*n
    for i in range(25, n):
        if ema12[i] is not None and ema26[i] is not None:
            macd_line[i] = ema12[i] - ema26[i]
    
    macd_signal = [None]*n
    k = 2/10
    for i in range(25, n):
        if macd_line[i] is None: continue
        if i == 25: macd_signal[i] = macd_line[i]
        else: macd_signal[i] = macd_line[i]*k + macd_signal[i-1]*(1-k)
    
    macd_hist = [None]*n
    for i in range(25, n):
        if macd_signal[i] is not None:
            macd_hist[i] = macd_line[i] - macd_signal[i]
    
    return cl, hi, lo, sma20, sd20, rsi14, cci14, atr14, macd_line, macd_signal, macd_hist

results = defaultdict(lambda: defaultdict(lambda: [0,0]))  # [wins, total]

def test(sym, name, direction, rows, idx):
    """idx is the current candle index. Test if next candle matches direction."""
    if idx + 1 >= len(rows): return
    r = results[sym][name]
    r[1] += 1
    if direction == 'RISE' and rows[idx+1]['c'] > rows[idx]['c']:
        r[0] += 1
    elif direction == 'FALL' and rows[idx+1]['c'] < rows[idx]['c']:
        r[0] += 1

for sym, path in FILES.items():
    rows = load(path)
    n = len(rows)
    cl, hi, lo, sma20, sd20, rsi14, cci14, atr14, macd_l, macd_s, macd_h = precompute(rows)
    
    for i in range(50, n-1):
        last = rows[i]
        prev = rows[i-1]
        
        # --- 1. Consecutive candle reversal ---
        for streak in [2,3,4,5]:
            if i < streak: continue
            all_up = all(cl[i-s] > cl[i-s-1] for s in range(1, streak+1))
            all_dn = all(cl[i-s] < cl[i-s-1] for s in range(1, streak+1))
            if all_up: test(sym, f'REV{streak}', 'FALL', rows, i)
            elif all_dn: test(sym, f'REV{streak}', 'RISE', rows, i)
        
        # --- 2. Consecutive + range expansion ---
        for streak in [2,3]:
            if i < streak: continue
            all_up = all(cl[i-s] > cl[i-s-1] for s in range(1, streak+1))
            all_dn = all(cl[i-s] < cl[i-s-1] for s in range(1, streak+1))
            if not (all_up or all_dn): continue
            avg_r = sum(rows[i-s]['h']-rows[i-s]['l'] for s in range(1, streak+1)) / streak
            last_r = prev['h']-prev['l']
            if last_r > avg_r * 1.3:
                test(sym, f'REV{streak}_WIDE', 'FALL' if all_up else 'RISE', rows, i)
        
        # --- 3. RSI extreme ---
        r = rsi14[i]
        if r is not None:
            if r <= 25 and last['c'] > last['o']:
                test(sym, 'RSI25_GREEN', 'RISE', rows, i)
            if r >= 75 and last['c'] < last['o']:
                test(sym, 'RSI75_RED', 'FALL', rows, i)
            body = abs(last['c']-last['o'])
            md = (last['h']+last['l'])/2
            bp = body/md*100 if md else 0
            if r <= 25 and bp > 0.02:
                test(sym, 'RSI25_BIGBODY', 'RISE', rows, i)
            if r >= 75 and bp > 0.02:
                test(sym, 'RSI75_BIGBODY', 'FALL', rows, i)
        
        # --- 4. RSI divergence ---
        if r is not None and i > 20:
            r_prev = rsi14[i-1]
            if r_prev is not None:
                low5 = min(cl[i-5:i+1])
                low4 = min(cl[i-5:i])
                if low5 < low4 and r > r_prev:
                    test(sym, 'RSI_BULL_DIV', 'RISE', rows, i)
                high5 = max(cl[i-5:i+1])
                high4 = max(cl[i-5:i])
                if high5 > high4 and r < r_prev:
                    test(sym, 'RSI_BEAR_DIV', 'FALL', rows, i)
        
        # --- 5. Bollinger Band ---
        m = sma20[i]
        sd = sd20[i]
        if m is not None and sd:
            u2 = m + 2*sd; l2 = m - 2*sd
            u2p5 = m + 2.5*sd; l2p5 = m - 2.5*sd
            if prev['l'] <= l2 and last['c'] > l2 and last['c'] > last['o']:
                test(sym, 'BB_LOWER_BOUNCE', 'RISE', rows, i)
            if prev['h'] >= u2 and last['c'] < u2 and last['c'] < last['o']:
                test(sym, 'BB_UPPER_BOUNCE', 'FALL', rows, i)
            if last['c'] >= u2 and last['c'] > last['o']:
                test(sym, 'BB_UPPER_WALK', 'RISE', rows, i)
            if last['c'] <= l2 and last['c'] < last['o']:
                test(sym, 'BB_LOWER_WALK', 'FALL', rows, i)
        
        # --- 6. Engulfing ---
        pb = abs(prev['c']-prev['o'])
        lb = abs(last['c']-last['o'])
        if pb > 0:
            if prev['c'] < prev['o'] and last['c'] > last['o'] and last['o'] < prev['c'] and last['c'] > prev['o']:
                test(sym, 'ENGULF_BULL', 'RISE', rows, i)
            if prev['c'] > prev['o'] and last['c'] < last['o'] and last['o'] > prev['c'] and last['c'] < prev['o']:
                test(sym, 'ENGULF_BEAR', 'FALL', rows, i)
            if prev['c'] < prev['o'] and last['c'] > last['o'] and lb > pb * 1.5:
                test(sym, 'ENGULF_BULL_BIG', 'RISE', rows, i)
            if prev['c'] > prev['o'] and last['c'] < last['o'] and lb > pb * 1.5:
                test(sym, 'ENGULF_BEAR_BIG', 'FALL', rows, i)
        
        # --- 7. Pin bar / hammer ---
        rng = last['h']-last['l']
        body = abs(last['c']-last['o'])
        if rng > 0:
            uw = last['h']-max(last['c'],last['o'])
            lw = min(last['c'],last['o'])-last['l']
            if lw > body*2 and lw/rng >= 0.6 and body/rng <= 0.3 and last['c'] > last['o']:
                test(sym, 'HAMMER', 'RISE', rows, i)
            if uw > body*2 and uw/rng >= 0.6 and body/rng <= 0.3 and last['c'] < last['o']:
                test(sym, 'SHOOTING_STAR', 'FALL', rows, i)
            low3 = min(r['l'] for r in rows[i-3:i])
            high3 = max(r['h'] for r in rows[i-3:i])
            if lw > body*2 and lw/rng>=0.6 and last['l'] <= low3 and last['c']>last['o']:
                test(sym, 'HAMMER_SWING', 'RISE', rows, i)
            if uw > body*2 and uw/rng>=0.6 and last['h'] >= high3 and last['c']<last['o']:
                test(sym, 'STAR_SWING', 'FALL', rows, i)
        
        # --- 8. Inside bar ---
        if prev['h'] > last['h'] and prev['l'] < last['l']:
            test(sym, 'INSIDE_BAR_BULL', 'RISE' if last['c'] > last['o'] else 'FALL', rows, i)
        
        # --- 9. Outside bar ---
        if last['h'] > prev['h'] and last['l'] < prev['l']:
            test(sym, 'OUTSIDE_BAR_BULL', 'RISE' if last['c'] > last['o'] else 'FALL', rows, i)
        
        # --- 10. Gap ---
        gp = abs(last['o']-prev['c'])/prev['c']*100
        if last['o'] > prev['c'] and gp > 0.01:
            test(sym, 'GAP_UP', 'FALL', rows, i)
        if last['o'] < prev['c'] and gp > 0.01:
            test(sym, 'GAP_DN', 'RISE', rows, i)
        
        # --- 11. Exhaustion (3 same-dir, narrowing range) ---
        if i > 3:
            if all(cl[i-s] > cl[i-s-1] for s in [1,2,3]):
                r1 = rows[i-1]['h']-rows[i-1]['l']
                r2 = rows[i-2]['h']-rows[i-2]['l']
                r3 = rows[i-3]['h']-rows[i-3]['l']
                if r1 < r2 < r3: test(sym, 'EXHAUST_BULL', 'FALL', rows, i)
            if all(cl[i-s] < cl[i-s-1] for s in [1,2,3]):
                r1 = rows[i-1]['h']-rows[i-1]['l']
                r2 = rows[i-2]['h']-rows[i-2]['l']
                r3 = rows[i-3]['h']-rows[i-3]['l']
                if r1 < r2 < r3: test(sym, 'EXHAUST_BEAR', 'RISE', rows, i)
        
        # --- 12. 2-bar reversal ---
        if i > 1:
            if prev['c'] < prev['o'] and last['c'] > last['o'] and last['c'] > prev['h']:
                test(sym, 'BULL_REV_2C', 'RISE', rows, i)
            if prev['c'] > prev['o'] and last['c'] < last['o'] and last['c'] < prev['l']:
                test(sym, 'BEAR_REV_2C', 'FALL', rows, i)
        
        # --- 13. Fakeout sweep ---
        if i > 13:
            sl = min(r['l'] for r in rows[i-12:i-1])
            sh = max(r['h'] for r in rows[i-12:i-1])
            if prev['l'] < sl and prev['c'] > sl and last['c'] > sl and last['c'] > prev['c']:
                test(sym, 'FAKEOUT_BULL', 'RISE', rows, i)
            if prev['h'] > sh and prev['c'] < sh and last['c'] < sh and last['c'] < prev['c']:
                test(sym, 'FAKEOUT_BEAR', 'FALL', rows, i)
        
        # --- 14. MACD cross ---
        h = macd_h[i] if i < len(macd_h) else None
        h_prev = macd_h[i-1] if i > 0 and i-1 < len(macd_h) else None
        if h is not None and h_prev is not None:
            if h_prev < 0 and h > 0:
                test(sym, 'MACD_CROSS_BULL', 'RISE', rows, i)
            if h_prev > 0 and h < 0:
                test(sym, 'MACD_CROSS_BEAR', 'FALL', rows, i)
        
        # --- 15. CCI extreme ---
        c = cci14[i]
        c_prev = cci14[i-1] if i > 0 else None
        if c is not None:
            if c >= 150: test(sym, 'CCI150', 'FALL', rows, i)
            if c <= -150: test(sym, 'CCI150', 'RISE', rows, i)
            if c_prev is not None and c_prev <= -150 and c > c_prev:
                test(sym, 'CCI150_REV', 'RISE', rows, i)
            if c_prev is not None and c_prev >= 150 and c < c_prev:
                test(sym, 'CCI150_REV', 'FALL', rows, i)
        
        # --- 16. Consecutive + RSI combo ---
        if r is not None:
            for streak in [2,3]:
                if i < streak: continue
                all_up = all(cl[i-s] > cl[i-s-1] for s in range(1, streak+1))
                all_dn = all(cl[i-s] < cl[i-s-1] for s in range(1, streak+1))
                if all_up and r >= 70: test(sym, f'REV{streak}_RSI70', 'FALL', rows, i)
                if all_dn and r <= 30: test(sym, f'REV{streak}_RSI30', 'RISE', rows, i)
        
        # --- 17. Consecutive + BB combo ---
        if m is not None and sd:
            for streak in [2,3]:
                if i < streak: continue
                all_up = all(cl[i-s] > cl[i-s-1] for s in range(1, streak+1))
                all_dn = all(cl[i-s] < cl[i-s-1] for s in range(1, streak+1))
                if all_up and prev['h'] >= m+2*sd:
                    test(sym, f'REV{streak}_BBTOP', 'FALL', rows, i)
                if all_dn and prev['l'] <= m-2*sd:
                    test(sym, f'REV{streak}_BBBTM', 'RISE', rows, i)
        
        # --- 18. High/Low at S/R ---
        if i > 11:
            high10 = max(r['h'] for r in rows[i-10:i])
            low10 = min(r['l'] for r in rows[i-10:i])
            if last['h'] >= high10 and last['c'] < last['o']:
                test(sym, 'S/R_HIGH_REJECT', 'FALL', rows, i)
            if last['l'] <= low10 and last['c'] > last['o']:
                test(sym, 'S/R_LOW_REJECT', 'RISE', rows, i)
        
        # --- 19. Twin same-direction + acceleration ---
        if i > 1:
            if prev['c'] > prev['o'] and last['c'] > last['o'] and (last['h']-last['l']) > (prev['h']-prev['l']):
                test(sym, 'TWIN_BULL', 'RISE', rows, i)
            if prev['c'] < prev['o'] and last['c'] < last['o'] and (last['h']-last['l']) > (prev['h']-prev['l']):
                test(sym, 'TWIN_BEAR', 'FALL', rows, i)
        
        # --- 20. Position within 20-bar range ---
        if i > 21:
            high20 = max(r['h'] for r in rows[i-20:i])
            low20 = min(r['l'] for r in rows[i-20:i])
            r20 = high20 - low20
            if r20 > 0:
                pos = (last['c'] - low20) / r20
                if pos <= 0.15 and last['c'] > last['o']:
                    test(sym, 'RANGE_LOW_BOUNCE', 'RISE', rows, i)
                if pos >= 0.85 and last['c'] < last['o']:
                    test(sym, 'RANGE_HIGH_REJECT', 'FALL', rows, i)
        
        # --- 21. Opening range breakout ---
        if i >= 3 and i % 4 == 0:
            o3h = max(r['h'] for r in rows[i-3:i+1])
            o3l = min(r['l'] for r in rows[i-3:i+1])
            if last['c'] > last['o'] and last['c'] > o3h:
                test(sym, 'BREAKOUT_BULL', 'RISE', rows, i)
            if last['c'] < last['o'] and last['c'] < o3l:
                test(sym, 'BREAKOUT_BEAR', 'FALL', rows, i)
        
        # --- 22. 3-bar inside/outside combo ---
        if i > 3:
            prev2 = rows[i-2]
            if prev2['h'] > prev['h'] and prev2['l'] < prev['l'] and prev['h'] < last['h'] and prev['l'] > last['l']:
                test(sym, 'CONTRACTION_EXPAND_BULL' if last['c']>last['o'] else 'CONTRACTION_EXPAND_BEAR',
                     'RISE' if last['c']>last['o'] else 'FALL', rows, i)

# ============================================================
# REPORT
# ============================================================
print("=" * 130)
print("TOP STRATEGIES BY MARKET (WR >= 55%, >= 10 trades)")
print("=" * 130)

for sym in sorted(results.keys()):
    items = [(n, d[0], d[1]) for n, d in results[sym].items() if d[1] >= 10]
    items.sort(key=lambda x: -x[1]/x[2]*100)
    best = [x for x in items if x[1]/x[2]*100 >= 55]
    if best:
        print(f"\n--- {sym} ---")
        for name, wins, total in best[:10]:
            wr = wins/total*100
            print(f"  {name:<30} {wins:>4}/{total:<4} = {wr:>5.1f}%")
        # Best strategy
        top = best[0]
        print(f"  -> BEST: {top[0]} @ {top[1]/top[2]*100:.1f}% ({top[1]}/{top[2]})")

print("\n" + "=" * 130)
print("CROSS-MARKET WINRATE (strategies averaged across all markets)")
print("=" * 130)

agg = defaultdict(lambda: {'wins':0,'total':0,'market_wrs':[]})
for sym in results:
    for name, (wins, total) in results[sym].items():
        if total < 5: continue
        agg[name]['wins'] += wins
        agg[name]['total'] += total
        agg[name]['market_wrs'].append((sym, wins/total*100))

cross = [(n, d['wins'], d['total']) for n, d in agg.items() if d['total'] >= 20]
cross.sort(key=lambda x: -x[1]/x[2]*100)

for name, wins, total in cross:
    wr = wins/total*100
    if wr >= 54:
        mwrs = sorted(d['market_wrs'] for d in [agg[name]])
        mstr = ', '.join(f"{m}({w:.0f}%)" for m,w in sorted(agg[name]['market_wrs'], key=lambda x:-x[1])[:3])
        print(f"{name:<30} {wins:>5}/{total:<5} = {wr:>5.1f}%  [{mstr}]")

print("\n" + "=" * 130)
print("HIGH_WR (>5 trades)")
print("=" * 130)
candidates = []
for sym in results:
    for name, (wins, total) in results[sym].items():
        if total >= 5 and wins/total*100 >= 75:
            candidates.append((sym, name, wins, total, wins/total*100))
candidates.sort(key=lambda x: -x[4])
for sym, name, wins, total, wr in candidates:
    print(f"{sym:<8} {name:<30} {wins:>3}/{total:<3} = {wr:>5.1f}%")
