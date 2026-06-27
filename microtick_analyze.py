"""
Micro-tick RISE/FALL prediction analysis.
Uses inter-candle gaps (close->open) as 1-tick proxy.
Also simulates N-tick direction from OHLC data.
Finds patterns with 80%+ winrate for sub-5-tick duration trades.
"""
import csv, math
from collections import defaultdict

FILES = {
    'R_10': r'C:\Users\b0231\Downloads\R_10_15s.csv',
    'R_25': r'C:\Users\b0231\Downloads\R_25_15s.csv',
    'R_50': r'C:\Users\b0231\Downloads\R_50_15s.csv',
    'R_75': r'C:\Users\b0231\Downloads\R_75_15s.csv',
    'R_100': r'C:\Users\b0231\Downloads\R_100_15s.csv',
    '1HZ10V': r'C:\Users\b0231\Downloads\1HZ10V_15s.csv',
    '1HZ25V': r'C:\Users\b0231\Downloads\1HZ25V_15s.csv',
    '1HZ50V': r'C:\Users\b0231\Downloads\1HZ50V_15s.csv',
    '1HZ75V': r'C:\Users\b0231\Downloads\1HZ75V_15s.csv',
    '1HZ100V': r'C:\Users\b0231\Downloads\1HZ100V_15s.csv',
}

def load(path):
    return [{
        'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
        'c':float(r['close']),'t':int(r['time_unix']),'n':int(r['ticks'])
    } for r in csv.DictReader(open(path))]

results = defaultdict(lambda: defaultdict(lambda: [0,0]))  # [wins, total]

def test(name, mkt, direction, cond):
    """direction: 'RISE' or 'FALL'. cond = (actual_rose, actual_fell, total)"""
    rose, fell, total = cond
    r = results[name][mkt]
    r[1] += total
    if direction == 'RISE': r[0] += rose
    else: r[0] += fell

print("=" * 120)
print("MICRO-TICK ANALYSIS (inter-candle gaps as 1-tick proxy)")
print("=" * 120)

all_1tick = []  # (sym, cond_name, wins, total, wr)

for sym, path in FILES.items():
    rows = load(path)
    n = len(rows)
    
    # Analyze inter-candle 1-tick direction: sign(open[N+1] - close[N])
    # Entry at close[N], 1-tick duration, win if next tick (open[N+1]) is higher/lower
    tick_ups = 0; tick_dns = 0; tick_eq = 0
    tick_gaps = []  # absolute gap sizes
    for i in range(n-1):
        gap = rows[i+1]['o'] - rows[i]['c']
        tick_gaps.append(abs(gap))
        if gap > 0: tick_ups += 1
        elif gap < 0: tick_dns += 1
        else: tick_eq += 1
    
    total_ticks = tick_ups + tick_dns + tick_eq
    base_up_pct = tick_ups / total_ticks * 100 if total_ticks > 0 else 0
    
    # --- CONDITION 1: Candle color predicts next tick ---
    for i in range(1, n-1):
        prev_candle_green = rows[i]['c'] > rows[i]['o']
        gap = rows[i+1]['o'] - rows[i]['c']
        
        if prev_candle_green:
            test('GRN_NEXT', sym, 'RISE', (gap>0, gap<0, 1) if gap!=0 else (0,0,0))
            test('GRN_NEXT_FALL', sym, 'FALL', (0,0,0) if gap==0 else (gap<0, gap>0, 1))
        else:
            test('RED_NEXT', sym, 'FALL', (gap<0, gap>0, 1) if gap!=0 else (0,0,0))
            test('RED_NEXT_RISE', sym, 'RISE', (0,0,0) if gap==0 else (gap>0, gap<0, 1))
    
    # --- CONDITION 2: Close position within candle predicts next tick ---
    for i in range(1, n-1):
        prev = rows[i]
        rng = prev['h'] - prev['l']
        if rng == 0: continue
        pos = (prev['c'] - prev['l']) / rng  # 0=low, 1=high
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        
        # Close in top 30%
        if pos >= 0.70:
            test('CLOSE_HIGH_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
            test('CLOSE_HIGH_NEXT_REV', sym, 'FALL', (gap<0, gap>0, 1))
        # Close in bottom 30%
        elif pos <= 0.30:
            test('CLOSE_LOW_NEXT', sym, 'FALL', (gap<0, gap>0, 1))
            test('CLOSE_LOW_NEXT_REV', sym, 'RISE', (gap>0, gap<0, 1))
        # Close in middle
        else:
            test('CLOSE_MID_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 3: Body-to-range ratio predicts next tick ---
    for i in range(1, n-1):
        prev = rows[i]
        rng = prev['h'] - prev['l']
        if rng == 0: continue
        body = abs(prev['c'] - prev['o'])
        ratio = body / rng
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        
        if ratio >= 0.70:  # strong body
            test('BIG_BODY_NEXT', sym, 'RISE' if prev['c']>prev['o'] else 'FALL', (gap>0 if prev['c']>prev['o'] else gap<0, gap<0 if prev['c']>prev['o'] else gap>0, 1))
        if ratio <= 0.20:  # doji
            test('SMALL_BODY_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 4: Wide-range vs narrow-range candle ---
    for i in range(2, n-1):
        curr_r = rows[i]['h'] - rows[i]['l']
        prev_r = rows[i-1]['h'] - rows[i-1]['l']
        if prev_r == 0: continue
        ratio = curr_r / prev_r
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        
        if ratio >= 1.5:  # expansion
            test('RANGE_EXPAND_NEXT', sym, 'RISE' if rows[i]['c']>rows[i]['o'] else 'FALL', (gap>0 if rows[i]['c']>rows[i]['o'] else gap<0, gap<0 if rows[i]['c']>rows[i]['o'] else gap>0, 1))
    
    # --- CONDITION 5: 2-candle sequence ---
    for i in range(2, n-1):
        c1, c2 = rows[i-1], rows[i]
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        # Two greens
        if c1['c'] > c1['o'] and c2['c'] > c2['o']:
            test('2GRN_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
            test('2GRN_NEXT_REV', sym, 'FALL', (gap<0, gap>0, 1))
        # Two reds
        if c1['c'] < c1['o'] and c2['c'] < c2['o']:
            test('2RED_NEXT', sym, 'FALL', (gap<0, gap>0, 1))
            test('2RED_NEXT_REV', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 6: Gap-up / gap-down ---
    for i in range(2, n-1):
        prev_gap = rows[i]['o'] - rows[i-1]['c']
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        if prev_gap > 0:
            test('GAP_UP_PREV', sym, 'RISE', (gap>0, gap<0, 1))
            test('GAP_UP_PREV_REV', sym, 'FALL', (gap<0, gap>0, 1))
        if prev_gap < 0:
            test('GAP_DN_PREV', sym, 'FALL', (gap<0, gap>0, 1))
            test('GAP_DN_PREV_REV', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 7: Tick count (number of ticks in candle) ---
    for i in range(1, n-1):
        nt = rows[i]['n']
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        if nt >= 6:
            test('MANY_TICKS_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
        if nt <= 3:
            test('FEW_TICKS_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 8: Candle + previous close position ---
    for i in range(2, n-1):
        prev_r = rows[i-1]['h'] - rows[i-1]['l']
        if prev_r == 0: continue
        prev_pos = (rows[i-1]['c'] - rows[i-1]['l']) / prev_r
        curr = rows[i]
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        # Previous closed high, current green → momentum
        if prev_pos >= 0.70 and curr['c'] > curr['o']:
            test('MOMENTUM_UP', sym, 'RISE', (gap>0, gap<0, 1))
            test('MOMENTUM_UP_REV', sym, 'FALL', (gap<0, gap>0, 1))
        # Previous closed low, current red → momentum
        if prev_pos <= 0.30 and curr['c'] < curr['o']:
            test('MOMENTUM_DN', sym, 'FALL', (gap<0, gap>0, 1))
            test('MOMENTUM_DN_REV', sym, 'RISE', (gap>0, gap<0, 1))
        # Previous closed high, current red → reversal
        if prev_pos >= 0.70 and curr['c'] < curr['o']:
            test('REVERSAL_DN', sym, 'FALL', (gap<0, gap>0, 1))
        # Previous closed low, current green → reversal
        if prev_pos <= 0.30 and curr['c'] > curr['o']:
            test('REVERSAL_UP', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 9: Consecutive ticks same direction ---
    for i in range(3, n-1):
        gap1 = rows[i-1]['o'] - rows[i-2]['c']
        gap2 = rows[i]['o'] - rows[i-1]['c']
        gap3 = rows[i+1]['o'] - rows[i]['c']
        if gap1 == 0 or gap2 == 0 or gap3 == 0: continue
        # 2 consecutive up
        if gap1 > 0 and gap2 > 0:
            test('2CONSEC_UP_NEXT', sym, 'RISE', (gap3>0, gap3<0, 1))
            test('2CONSEC_UP_REV', sym, 'FALL', (gap3<0, gap3>0, 1))
        # 2 consecutive down
        if gap1 < 0 and gap2 < 0:
            test('2CONSEC_DN_NEXT', sym, 'FALL', (gap3<0, gap3>0, 1))
            test('2CONSEC_DN_REV', sym, 'RISE', (gap3>0, gap3<0, 1))
    
    # --- CONDITION 10: Range contraction after expansion ---
    for i in range(3, n-1):
        r1 = rows[i-2]['h'] - rows[i-2]['l']
        r2 = rows[i-1]['h'] - rows[i-1]['l']
        r3 = rows[i]['h'] - rows[i]['l']
        if r1 == 0 or r2 == 0: continue
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        # Expansion then contraction (volatility climax)
        if r1 > r2 and r2 > r3:
            test('VOL_CLIMAX', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 11: Strong trend run ---
    for i in range(4, n-1):
        closes_4 = [rows[i-j]['c'] for j in range(4)]
        trend = closes_4[0] - closes_4[3]
        gap = rows[i+1]['o'] - rows[i]['c']
        if gap == 0: continue
        # 4 consecutive higher closes
        if all(rows[i-j]['c'] > rows[i-j-1]['c'] for j in range(3)):
            test('4UP_NEXT', sym, 'RISE', (gap>0, gap<0, 1))
            test('4UP_REV', sym, 'FALL', (gap<0, gap>0, 1))
        # 4 consecutive lower closes
        if all(rows[i-j]['c'] < rows[i-j-1]['c'] for j in range(3)):
            test('4DN_NEXT', sym, 'FALL', (gap<0, gap>0, 1))
            test('4DN_REV', sym, 'RISE', (gap>0, gap<0, 1))
    
    # --- CONDITION 12: Previous tick direction (single inter-candle transition) ---
    for i in range(2, n-1):
        prev_gap = rows[i]['o'] - rows[i-1]['c']
        curr_gap = rows[i+1]['o'] - rows[i]['c']
        if prev_gap == 0 or curr_gap == 0: continue
        # Previous was up
        if prev_gap > 0:
            test('TICK_UP_BEFORE', sym, 'RISE', (curr_gap>0, curr_gap<0, 1))
        # Previous was down
        if prev_gap < 0:
            test('TICK_DN_BEFORE', sym, 'FALL', (curr_gap<0, curr_gap>0, 1))

print("\n--- BASE RATES ---")
for sym, path in FILES.items():
    rows = load(path)
    ups = dns = 0
    for i in range(len(rows)-1):
        g = rows[i+1]['o'] - rows[i]['c']
        if g > 0: ups += 1
        elif g < 0: dns += 1
    t = ups + dns
    print(f"  {sym:<10} 1-tick RISE rate: {ups}/{t} = {ups/t*100:.1f}%  (1-tick FALL: {dns/t*100:.1f}%)")

print("\n" + "=" * 120)
print("TOP 1-TICK PREDICTIONS PER MARKET (WR >= 60%, >= 20 trades)")
print("=" * 120)

all_results = []
for sym in sorted(results.keys()):
    items = [(n, d[0], d[1]) for n, d in results[sym].items() if d[1] >= 20]
    items.sort(key=lambda x: -x[1]/x[2]*100)
    top = [x for x in items if x[1]/x[2]*100 >= 60]
    if top:
        print(f"\n--- {sym} ---")
        for name, wins, total in top:
            wr = wins/total*100
            print(f"  {name:<35} {wins:>4}/{total:<4} = {wr:>5.1f}%")
            all_results.append((sym, name, wins, total, wr))

print("\n" + "=" * 120)
print("CROSS-MARKET CONSISTENCY (combined all markets)")
print("=" * 120)

agg = defaultdict(lambda: [0,0])
for sym in results:
    for name, (wins, total) in results[sym].items():
        agg[name][0] += wins
        agg[name][1] += total

cross = [(n, d[0], d[1]) for n, d in agg.items() if d[1] >= 50]
cross.sort(key=lambda x: -x[1]/x[2]*100)

for name, wins, total in cross:
    wr = wins/total*100
    if wr >= 56:
        print(f"{name:<35} {wins:>5}/{total:<5} = {wr:>5.1f}%")

print("\n" + "=" * 120)
print("80%+ CANDIDATES (>= 5 trades)")
print("=" * 120)
for sym, name, wins, total, wr in sorted(all_results, key=lambda x: -x[4]):
    if wr >= 70 and total >= 5:
        print(f"{sym:<10} {name:<35} {wins:>3}/{total:<3} = {wr:>5.1f}%")

# Simulate N-tick direction using weighted tick position
print("\n" + "=" * 120)
print("N-TICK SIMULATION (price after k ticks ≈ O + (C-O) * k/N)")
print("=" * 120)
for n_ticks in [2, 3, 4, 5]:
    print(f"\n--- {n_ticks}-TICK DURATION (RISE = price after {n_ticks}t > entry price) ---")
    for sym, path in FILES.items():
        rows = load(path)
        wins = 0; total = 0
        for i in range(len(rows)-1):
            # Entry at close of candle i
            entry = rows[i]['c']
            # Next candle has N ticks, price after k ticks ≈ O + (C-O) * k/n
            next_c = rows[i+1]
            cnt = next_c['n']
            if cnt < n_ticks: continue  # skip if not enough ticks in next candle
            # Price after n_ticks ticks: linear interpolation
            frac = n_ticks / cnt
            price_k = next_c['o'] + (next_c['c'] - next_c['o']) * frac
            total += 1
            if price_k > entry: wins += 1
        if total > 0:
            wr = wins/total*100
            if wr >= 55:
                print(f"  {sym:<10} {wins:>4}/{total:<4} = {wr:>5.1f}%")
