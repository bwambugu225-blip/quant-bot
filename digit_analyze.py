"""
Pure statistical digit analysis from 15s OHLC data.
Extracts last digit from close prices, tests ALL possible prediction models
for Over/Under and Even/Odd.
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
    rows = []
    with open(path) as f:
        for r in csv.DictReader(f):
            rows.append({
                'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
                'c':float(r['close']),'t':int(r['time_unix']),'n':int(r['ticks'])
            })
    return rows

# Store results
# Results format: { strategy_key: { market: {wins, total, wr} } }
results = defaultdict(lambda: defaultdict(lambda: {'wins':0,'total':0}))

def test(name, market, direction, actual_next_digit):
    """Test if prediction was correct"""
    r = results[name][market]
    r['total'] += 1
    if direction == 'OVER' and actual_next_digit >= 5:
        r['wins'] += 1
    elif direction == 'UNDER' and actual_next_digit <= 4:
        r['wins'] += 1
    elif direction == 'EVEN' and actual_next_digit % 2 == 0:
        r['wins'] += 1
    elif direction == 'ODD' and actual_next_digit % 2 == 1:
        r['wins'] += 1

def digit(price):
    """Extract last digit before decimal"""
    s = f"{price:.2f}"
    return int(s[-1])

print("=" * 100)
print("DIGIT ANALYSIS - ALL MARKETS")
print("=" * 100)

for sym, path in FILES.items():
    rows = load(path)
    n = len(rows)
    digits_ = [digit(r['c']) for r in rows]
    closes_ = [r['c'] for r in rows]
    
    # --- Base rate check ---
    over_cnt = sum(1 for d in digits_ if d >= 5)
    even_cnt = sum(1 for d in digits_ if d % 2 == 0)
    
    for i in range(1, n):
        curr = digits_[i-1]
        nextd = digits_[i]
        
        # --- 1. Pure digit prediction (current digit predicts next) ---
        # For each digit 0-9, what's the probability of next being OVER/UNDER/EVEN/ODD?
        for d in range(10):
            if curr == d:
                test(f'CUR_{d}_OVER', sym, 'OVER', nextd)
                test(f'CUR_{d}_UNDER', sym, 'UNDER', nextd)
                test(f'CUR_{d}_EVEN', sym, 'EVEN', nextd)
                test(f'CUR_{d}_ODD', sym, 'ODD', nextd)
        
        # --- 2. Over/Under sequence (current over/under predicts next) ---
        curr_over = curr >= 5
        if curr_over:
            test('OVER_SEQ_OVER', sym, 'OVER', nextd)
            test('OVER_SEQ_UNDER', sym, 'UNDER', nextd)
        else:
            test('UNDER_SEQ_OVER', sym, 'OVER', nextd)
            test('UNDER_SEQ_UNDER', sym, 'UNDER', nextd)
        
        # --- 3. Even/Odd sequence ---
        curr_even = curr % 2 == 0
        if curr_even:
            test('EVEN_SEQ_EVEN', sym, 'EVEN', nextd)
            test('EVEN_SEQ_ODD', sym, 'ODD', nextd)
        else:
            test('ODD_SEQ_EVEN', sym, 'EVEN', nextd)
            test('ODD_SEQ_ODD', sym, 'ODD', nextd)
        
        # --- 4. Direction-based digit prediction ---
        if i >= 2:
            prev_c = closes_[i-2]
            curr_c = closes_[i-1]
            up = curr_c > prev_c
            
            if up:
                test('UP_OVER', sym, 'OVER', nextd)
                test('UP_UNDER', sym, 'UNDER', nextd)
                test('UP_EVEN', sym, 'EVEN', nextd)
                test('UP_ODD', sym, 'ODD', nextd)
            else:
                test('DN_OVER', sym, 'OVER', nextd)
                test('DN_UNDER', sym, 'UNDER', nextd)
                test('DN_EVEN', sym, 'EVEN', nextd)
                test('DN_ODD', sym, 'ODD', nextd)
    
    # --- 5. 2-digit sequence analysis ---
    # Which specific digit pairs have edges?
    if n > 2:
        for i in range(2, n):
            d1 = digits_[i-2]
            d2 = digits_[i-1]
            nextd = digits_[i]
            key = f'PAIR_{d1}{d2}'
            test(f'{key}_OVER', sym, 'OVER', nextd)
            test(f'{key}_UNDER', sym, 'UNDER', nextd)
            test(f'{key}_EVEN', sym, 'EVEN', nextd)
            test(f'{key}_ODD', sym, 'ODD', nextd)
            
            # Over/Under pair version
            o1 = 'O' if d1 >= 5 else 'U'
            o2 = 'O' if d2 >= 5 else 'U'
            pkey = f'OU_{o1}{o2}'
            test(f'{pkey}_OVER', sym, 'OVER', nextd)
            test(f'{pkey}_UNDER', sym, 'UNDER', nextd)
            
            # Even/Odd pair version
            e1 = 'E' if d1 % 2 == 0 else 'D'
            e2 = 'E' if d2 % 2 == 0 else 'D'
            ekey = f'EO_{e1}{e2}'
            test(f'{ekey}_EVEN', sym, 'EVEN', nextd)
            test(f'{ekey}_ODD', sym, 'ODD', nextd)
    
    # --- 6. Volatility-adjusted digit ---
    if n > 2:
        for i in range(2, n):
            rng = rows[i-1]['h'] - rows[i-1]['l']
            avg5 = sum(rows[i-1-j]['h'] - rows[i-1-j]['l'] for j in range(min(5, i-1))) / min(5, i-1)
            nextd = digits_[i]
            wide = rng > avg5 * 1.3
            narrow = rng < avg5 * 0.7
            
            if wide:
                test('WIDE_OVER', sym, 'OVER', nextd)
                test('WIDE_UNDER', sym, 'UNDER', nextd)
                test('WIDE_EVEN', sym, 'EVEN', nextd)
                test('WIDE_ODD', sym, 'ODD', nextd)
            if narrow:
                test('NARROW_OVER', sym, 'OVER', nextd)
                test('NARROW_UNDER', sym, 'UNDER', nextd)
                test('NARROW_EVEN', sym, 'EVEN', nextd)
                test('NARROW_ODD', sym, 'ODD', nextd)
    
    # --- 7. Trend strength + digit ---
    if n > 5:
        for i in range(5, n):
            trend = closes_[i-1] - closes_[i-5]
            pct = trend / closes_[i-5] * 100
            nextd = digits_[i]
            if pct > 0.1:
                test('STRONG_UP_OVER', sym, 'OVER', nextd)
                test('STRONG_UP_UNDER', sym, 'UNDER', nextd)
                test('STRONG_UP_EVEN', sym, 'EVEN', nextd)
                test('STRONG_UP_ODD', sym, 'ODD', nextd)
            elif pct < -0.1:
                test('STRONG_DN_OVER', sym, 'OVER', nextd)
                test('STRONG_DN_UNDER', sym, 'UNDER', nextd)
                test('STRONG_DN_EVEN', sym, 'EVEN', nextd)
                test('STRONG_DN_ODD', sym, 'ODD', nextd)

# ============================================================
# REPORT
# ============================================================
print("\nDigit base rates across markets:")
for sym, path in FILES.items():
    rows = load(path)
    dig = [digit(r['c']) for r in rows]
    over = sum(1 for d in dig if d >= 5) / len(dig) * 100
    even = sum(1 for d in dig if d % 2 == 0) / len(dig) * 100
    dist = [dig.count(d) for d in range(10)]
    print(f"  {sym:<10} OVER={over:.1f}% EVEN={even:.1f}%  digits={dist}")

print("\n" + "=" * 100)
print("TOP DIGIT STRATEGIES (WR >= 55%, >= 20 trades per market)")
print("=" * 100)

# Aggregate and filter
all_digit_strats = []
for name, markets in results.items():
    for mkt, r in markets.items():
        if r['total'] >= 20:
            wr = r['wins'] / r['total'] * 100
            all_digit_strats.append((name, mkt, r['wins'], r['total'], wr))

all_digit_strats.sort(key=lambda x: -x[4])

# Print top per market
seen_markets = set()
for name, mkt, wins, total, wr in all_digit_strats:
    if wr >= 55 and mkt not in seen_markets:
        seen_markets.add(mkt)
        print(f"\n--- {mkt} ---")
    if wr >= 55:
        print(f"  {name:<35} {wins:>4}/{total:<4} = {wr:>5.1f}%")

print("\n" + "=" * 100)
print("CONSISTENT CROSS-MARKET DIGIT STRATEGIES (>=50 total, >= 55%)")
print("=" * 100)

# Aggregate same strategy across markets
agg_digit = defaultdict(lambda: {'wins':0,'total':0,'mkt':[]})
for name, markets in results.items():
    for mkt, r in markets.items():
        agg_digit[name]['wins'] += r['wins']
        agg_digit[name]['total'] += r['total']
        if r['total'] >= 15:
            agg_digit[name]['mkt'].append((mkt, r['wins']/r['total']*100))

digit_cross = [(n, d['wins'], d['total']) for n, d in agg_digit.items() if d['total'] >= 50]
digit_cross.sort(key=lambda x: -x[1]/x[2]*100)

for name, wins, total in digit_cross:
    wr = wins/total*100
    if wr >= 53:
        mks = sorted(agg_digit[name]['mkt'], key=lambda x: -x[1])
        mstr = ', '.join(f"{m}({w:.0f}%)" for m,w in mks[:3])
        print(f"{name:<35} {wins:>5}/{total:<5} = {wr:>5.1f}%  [{mstr}]")

# Now find the absolute best models by combining top features
print("\n" + "=" * 100)
print("BEST SINGLE-DIGIT MODELS (each digit 0-9)")
print("=" * 100)

# Aggregate by digit prediction
for d in range(10):
    key_over = f'CUR_{d}_OVER'
    key_under = f'CUR_{d}_UNDER'
    key_even = f'CUR_{d}_EVEN'
    key_odd = f'CUR_{d}_ODD'
    
    for key, label in [(key_over, 'OVER'), (key_under, 'UNDER'), (key_even, 'EVEN'), (key_odd, 'ODD')]:
        if key in agg_digit:
            d_ = agg_digit[key]
            if d_['total'] >= 50:
                wr = d_['wins'] / d_['total'] * 100
                if wr >= 55:
                    mks = sorted(d_['mkt'], key=lambda x: -x[1])
                    mstr = ', '.join(f"{m}({w:.0f}%)" for m,w in mks[:3])
                    print(f"CUR={d}->{label:<8} {d_['wins']:>5}/{d_['total']:<5} = {wr:>5.1f}%  [{mstr}]")

# Two-digit pair models
print("\n" + "=" * 100)
print("BEST 2-DIGIT PAIR MODELS (>=30 total)")
print("=" * 100)

pair_strats = []
for name, d_ in agg_digit.items():
    if name.startswith('PAIR_') and d_['total'] >= 30:
        wr = d_['wins'] / d_['total'] * 100
        pair_strats.append((name, d_['wins'], d_['total'], wr))
pair_strats.sort(key=lambda x: -x[3])

for name, wins, total, wr in pair_strats[:30]:
    if wr >= 55:
        mks = sorted(agg_digit[name]['mkt'], key=lambda x: -x[1])
        mstr = ', '.join(f"{m}({w:.0f}%)" for m,w in mks[:2])
        print(f"{name:<35} {wins:>4}/{total:<4} = {wr:>5.1f}%  [{mstr}]")

# Over/Under pair models
print("\n" + "=" * 100)
print("BEST OU PAIR MODELS (>=50 total)")
print("=" * 100)
ou_strats = [(n, d_['wins'], d_['total']) for n, d_ in agg_digit.items() if n.startswith('OU_') and d_['total'] >= 50]
ou_strats.sort(key=lambda x: -x[1]/x[2]*100)
for name, wins, total in ou_strats:
    wr = wins/total*100
    if wr >= 55:
        print(f"{name:<35} {wins:>5}/{total:<5} = {wr:>5.1f}%")

# Even/Odd pair models
print("\n" + "=" * 100)
print("BEST EO PAIR MODELS (>=50 total)")
print("=" * 100)
eo_strats = [(n, d_['wins'], d_['total']) for n, d_ in agg_digit.items() if n.startswith('EO_') and d_['total'] >= 50]
eo_strats.sort(key=lambda x: -x[1]/x[2]*100)
for name, wins, total in eo_strats:
    wr = wins/total*100
    if wr >= 55:
        print(f"{name:<35} {wins:>5}/{total:<5} = {wr:>5.1f}%")
