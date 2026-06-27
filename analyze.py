import csv, glob, math, json
from collections import defaultdict
from pathlib import Path

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

def load_csv(path):
    rows = []
    with open(path) as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({
                'o': float(r['open']), 'h': float(r['high']), 'l': float(r['low']),
                'c': float(r['close']), 't': int(r['time_unix'])
            })
    return rows

def sma(arr, n):
    if len(arr) < n: return None
    return sum(arr[-n:]) / n

def rsi_arr(closes, n=14):
    if len(closes) < n + 1: return None
    gains, losses = 0, 0
    for i in range(-n, 0):
        d = closes[i] - closes[i-1]
        if d > 0: gains += d
        else: losses -= d
    avg_g = gains / n
    avg_l = losses / n
    if avg_l == 0: return 100
    rs = avg_g / avg_l
    return 100 - (100 / (1 + rs))

def analyze_market(name, rows):
    closes = [r['c'] for r in rows]
    highs = [r['h'] for r in rows]
    lows = [r['l'] for r in rows]
    n = len(rows)
    if n < 50: return None
    
    # Range statistics
    ranges = [(r['h'] - r['l']) for r in rows]
    avg_range = sum(ranges) / len(ranges)
    mid_price = sum(closes) / len(closes)
    avg_range_pct = (avg_range / mid_price) * 100 if mid_price else 0
    
    # Directional consecutive candle analysis
    same_dir_win = {2: 0, 3: 0, 4: 0}
    opp_dir_win = {2: 0, 3: 0, 4: 0}
    same_dir_total = {2: 0, 3: 0, 4: 0}
    opp_dir_total = {2: 0, 3: 0, 4: 0}
    
    for i in range(5, n - 1):
        # Check consecutive moves
        for streak in [2, 3, 4]:
            if i < streak + 1: continue
            prev_dirs = []
            for s in range(1, streak + 1):
                prev_dirs.append(closes[i-s] > closes[i-s-1])
            all_up = all(prev_dirs)
            all_down = not any(prev_dirs)
            
            if all_up or all_down:
                direction = 'RISE' if all_up else 'FALL'
                next_move = closes[i] > closes[i-1]
                won = (direction == 'RISE' and next_move) or (direction == 'FALL' and not next_move)
                same_dir_total[streak] += 1
                if won: same_dir_win[streak] += 1
                
                # Opposite direction trade
                opp_won = (direction == 'RISE' and not next_move) or (direction == 'FALL' and next_move)
                opp_dir_total[streak] += 1
                if opp_won: opp_dir_win[streak] += 1
    
    # Mean reversion analysis
    reversal_win = 0
    reversal_total = 0
    for i in range(2, n - 1):
        prev_range = highs[i-1] - lows[i-1]
        curr_range = highs[i] - lows[i]
        prev_dir = closes[i-1] > closes[i-2]
        curr_dir = closes[i] > closes[i-1]
        
        # Big move followed by reversal
        if curr_range > avg_range * 1.5 and prev_dir != curr_dir:
            reversal_total += 1
            # Check if next candle continues the reversal
            if i + 1 < n:
                next_dir = closes[i+1] > closes[i]
                if next_dir == curr_dir:
                    reversal_win += 1

    # RSI extremes analysis
    rsi_extreme_win = 0
    rsi_extreme_total = 0
    for i in range(16, n - 1):
        r = rsi_arr(closes[:i+1], 14)
        if r is None: continue
        r_prev = rsi_arr(closes[:i], 14)
        if r_prev is None: continue
        
        last = rows[i]
        if r_prev <= 25 and r > r_prev and last['c'] > last['o']:
            rsi_extreme_total += 1
            if i + 1 < n and closes[i+1] > closes[i]:
                rsi_extreme_win += 1
        elif r_prev >= 75 and r < r_prev and last['c'] < last['o']:
            rsi_extreme_total += 1
            if i + 1 < n and closes[i+1] < closes[i]:
                rsi_extreme_win += 1
    
    # RISE/FALL balance
    ups = sum(1 for i in range(1, n) if closes[i] > closes[i-1])
    downs = n - 1 - ups
    
    return {
        'name': name,
        'candles': n,
        'price': round(mid_price, 2),
        'avg_range': round(avg_range, 4),
        'avg_range_pct': round(avg_range_pct, 4),
        'up_pct': round(ups / (n-1) * 100, 1),
        'down_pct': round(downs / (n-1) * 100, 1),
        'reversal_after_big_move': f"{reversal_win}/{reversal_total} ({round(reversal_win/reversal_total*100, 1) if reversal_total else 0}%)",
        'rsi_extreme': f"{rsi_extreme_win}/{rsi_extreme_total} ({round(rsi_extreme_win/rsi_extreme_total*100, 1) if rsi_extreme_total else 0}%)",
    }

def analyze_mean_reversion(name, rows):
    closes = [r['c'] for r in rows]
    n = len(rows)
    if n < 50: return None
    
    results = {}
    
    # Test: trade REVERSAL after N consecutive same-direction candles
    for streak in [1, 2, 3, 4]:
        wins = 0
        total = 0
        for i in range(streak + 2, n - 1):
            same_dir = True
            for s in range(streak):
                current_dir = closes[i-1-s] > closes[i-2-s]
                if s > 0 and current_dir != prev_dir:
                    same_dir = False
                    break
                prev_dir = current_dir
            
            if not same_dir: continue
            
            all_up = closes[i-1] > closes[i-2]
            total += 1
            # Trade REVERSAL: RISE after downtrend
            if all_up:
                if closes[i] < closes[i-1]: wins += 1
            else:
                if closes[i] > closes[i-1]: wins += 1
        
        winrate = round(wins / total * 100, 1) if total else 0
        results[f'reversal_after_{streak}'] = f"{wins}/{total} ({winrate}%)"
    
    return results

def analyze_bb(name, rows):
    closes = [r['c'] for r in rows]
    n = len(rows)
    if n < 22: return None
    
    wins_2s = 0; total_2s = 0
    wins_2p5s = 0; total_2p5s = 0
    
    for i in range(22, n - 1):
        chunk = closes[i-20:i]
        m = sum(chunk) / 20
        var = sum((x - m) ** 2 for x in chunk) / 20
        sd = math.sqrt(var) if var > 0 else 0
        if sd == 0: continue
        upper_2p5 = m + 2.5 * sd
        lower_2p5 = m - 2.5 * sd
        upper_2 = m + 2 * sd
        lower_2 = m - 2 * sd
        prev = rows[i-1]
        curr = rows[i]
        
        # 2.5 sigma test
        if prev['l'] <= lower_2p5 and curr['c'] > lower_2p5 and curr['c'] > curr['o']:
            total_2p5s += 1
            if i + 1 < n and closes[i+1] > closes[i]: wins_2p5s += 1
        if prev['h'] >= upper_2p5 and curr['c'] < upper_2p5 and curr['c'] < curr['o']:
            total_2p5s += 1
            if i + 1 < n and closes[i+1] < closes[i]: wins_2p5s += 1
        
        # 2.0 sigma test
        if prev['l'] <= lower_2 and curr['c'] > lower_2 and curr['c'] > curr['o']:
            total_2s += 1
            if i + 1 < n and closes[i+1] > closes[i]: wins_2s += 1
        if prev['h'] >= upper_2 and curr['c'] < upper_2 and curr['c'] < curr['o']:
            total_2s += 1
            if i + 1 < n and closes[i+1] < closes[i]: wins_2s += 1

    return {
        'bb_2s': f"{wins_2s}/{total_2s} ({round(wins_2s/total_2s*100,1) if total_2s else 0}%)",
        'bb_2p5s': f"{wins_2p5s}/{total_2p5s} ({round(wins_2p5s/total_2p5s*100,1) if total_2p5s else 0}%)",
    }

def analyze_range_and_vol(name, rows):
    """Find optimal range threshold for filtering"""
    closes = [r['c'] for r in rows]
    ranges = [(r['h'] - r['l']) for r in rows]
    n = len(rows)
    if n < 20: return None
    
    mid = sum(closes) / len(closes)
    range_pcts = [(h_l / mid) * 100 for h_l in ranges]
    
    sorted_pcts = sorted(range_pcts)
    p25 = sorted_pcts[len(sorted_pcts)//4]
    p50 = sorted_pcts[len(sorted_pcts)//2]
    p75 = sorted_pcts[3*len(sorted_pcts)//4]
    
    return {
        'range_pct_p25': round(p25, 4),
        'range_pct_p50': round(p50, 4),
        'range_pct_p75': round(p75, 4),
    }

print("=" * 100)
print("DERIV SYNTHETIC INDICES — 15s CANDLE ANALYSIS")
print("=" * 100)

all_results = {}
for sym, path in FILES.items():
    rows = load_csv(path)
    result = analyze_market(sym, rows)
    if result:
        all_results[sym] = result
        
        mr = analyze_mean_reversion(sym, rows)
        bb = analyze_bb(sym, rows)
        rv = analyze_range_and_vol(sym, rows)
        if mr: result.update(mr)
        if bb: result.update(bb)
        if rv: result.update(rv)

# Print
for sym, r in all_results.items():
    if not r: continue
    print(f"\n--- {sym} ({r.get('candles',0)} candles, ~${r.get('price',0)}) ---")
    print(f"  Avg range: {r.get('avg_range_pct','?')}%  |  Up/Down: {r.get('up_pct','?')}/{r.get('down_pct','?')}%")
    print(f"  Range P25/P50/P75: {r.get('range_pct_p25','?')}/{r.get('range_pct_p50','?')}/{r.get('range_pct_p75','?')}%")
    print(f"  Reversal after big move: {r.get('reversal_after_big_move','?')}")
    print(f"  RSI extreme reversal: {r.get('rsi_extreme','?')}")
    
    for s in ['reversal_after_1', 'reversal_after_2', 'reversal_after_3', 'reversal_after_4']:
        if s in r:
            print(f"  {s}: {r[s]}")
    
    for b in ['bb_2s', 'bb_2p5s']:
        if b in r:
            print(f"  {b}: {r[b]}")

print("\n" + "=" * 100)
print("OPTIMAL STRATEGY PARAMETERS")
print("=" * 100)

# Aggregate conclusions
for threshold in ['range_pct_p25', 'range_pct_p50', 'range_pct_p75']:
    vals = [r[threshold] for r in all_results.values() if threshold in r]
    if vals:
        avg = round(sum(vals)/len(vals), 4)
        print(f"  Avg {threshold}: {avg}%")

# Print JSON for bot
print("\n// JSON for bot.html evaluateAndTrade:")
print(json.dumps({
    k: {
        'avg_range_pct': v.get('avg_range_pct'),
        'range_p25': v.get('range_pct_p25'),
        'range_p50': v.get('range_pct_p50'),
        'range_p75': v.get('range_pct_p75'),
        'up_pct': v.get('up_pct'),
    } for k, v in all_results.items()
}, indent=2))
