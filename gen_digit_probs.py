"""
Generate digit probability tables for the bot from CSV data.
Outputs compact JS object with transition probabilities.
"""
import csv, json
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

def digit(price):
    return int(f"{price:.2f}"[-1])

def load(path):
    rows = []
    with open(path) as f:
        for r in csv.DictReader(f):
            rows.append({
                'o':float(r['open']),'h':float(r['high']),'l':float(r['low']),
                'c':float(r['close']),'t':int(r['time_unix'])
            })
    return rows

# Collect all transition data
# For each symbol, build:
# 1. digit_counts: how many times each digit 0-9 appeared
# 2. transitions: P(next_digit | current_digit) as 10x10 matrix
# 3. ou_transitions: P(next_over | current_over/under)
# 4. eo_transitions: P(next_even | current_even/odd)
# 5. pair_ou: P(next_over | last 2 OU pattern)
# 6. pair_eo: P(next_even | last 2 EO pattern)

all_data = {}
for sym, path in FILES.items():
    rows = load(path)
    n = len(rows)
    digits = [digit(r['c']) for r in rows]
    
    # 1. Digit counts
    cnt = [0]*10
    for d in digits:
        cnt[d] += 1
    
    # 2. Digit transitions (10x10)
    trans = [[0]*10 for _ in range(10)]
    for i in range(1, n):
        trans[digits[i-1]][digits[i]] += 1
    
    # 3. OU transitions: curr_over/under -> next_over/under
    ou_cnt = {'O':0,'U':0}
    ou_ok = {'O':0,'U':0}
    for i in range(1, n):
        curr_ou = 'O' if digits[i-1] >= 5 else 'U'
        next_ou = 'O' if digits[i] >= 5 else 'U'
        ou_cnt[curr_ou] += 1
        if (curr_ou == 'O' and next_ou == 'O') or (curr_ou == 'U' and next_ou == 'U'):
            ou_ok[curr_ou] += 1
    
    # 4. EO transitions: curr_even/odd -> next_even/odd
    eo_cnt = {'E':0,'D':0}
    eo_ok = {'E':0,'D':0}
    for i in range(1, n):
        curr_eo = 'E' if digits[i-1] % 2 == 0 else 'D'
        next_eo = 'E' if digits[i] % 2 == 0 else 'D'
        eo_cnt[curr_eo] += 1
        if (curr_eo == 'E' and next_eo == 'E') or (curr_eo == 'D' and next_eo == 'D'):
            eo_ok[curr_eo] += 1
    
    # 5. Pair OU: last 2 OU -> next_OU
    pair_ou_cnt = defaultdict(int)
    pair_ou_ok = defaultdict(int)
    for i in range(2, n):
        d1 = 'O' if digits[i-2] >= 5 else 'U'
        d2 = 'O' if digits[i-1] >= 5 else 'U'
        nd = 'O' if digits[i] >= 5 else 'U'
        key = d1+d2
        pair_ou_cnt[key] += 1
        if nd == 'O':
            pair_ou_ok[key] += 1
    
    # 6. Pair EO: last 2 EO -> next_EO
    pair_eo_cnt = defaultdict(int)
    pair_eo_ok = defaultdict(int)
    for i in range(2, n):
        d1 = 'E' if digits[i-2] % 2 == 0 else 'D'
        d2 = 'E' if digits[i-1] % 2 == 0 else 'D'
        nd = 'E' if digits[i] % 2 == 0 else 'D'
        key = d1+d2
        pair_eo_cnt[key] += 1
        if nd == 'E':
            pair_eo_ok[key] += 1
    
    # 7. Digit-specific OU probs
    digit_ou = {}
    for d in range(10):
        total = sum(trans[d])
        if total > 0:
            next_over = sum(trans[d][5:])
            digit_ou[d] = round(next_over / total * 100)
    
    # 8. Digit-specific EO probs
    digit_eo = {}
    for d in range(10):
        total = sum(trans[d])
        if total > 0:
            next_even = sum(trans[d][0:10:2])
            digit_eo[d] = round(next_even / total * 100)
    
    # 9. Direction + digit (up/down effect)
    dir_digit_over = {'up':0,'dn':0}
    dir_digit_total = {'up':0,'dn':0}
    for i in range(2, n):
        up = rows[i-1]['c'] > rows[i-2]['c']
        key = 'up' if up else 'dn'
        dir_digit_total[key] += 1
        if digits[i] >= 5:
            dir_digit_over[key] += 1
    
    all_data[sym] = {
        'dc': cnt,
        'ou': {k: round(ou_ok[k]/ou_cnt[k]*100) for k in ou_cnt if ou_cnt[k] > 0},
        'eo': {k: round(eo_ok[k]/eo_cnt[k]*100) for k in eo_cnt if eo_cnt[k] > 0},
        'pou': {k: round(pair_ou_ok[k]/pair_ou_cnt[k]*100) for k in pair_ou_cnt if pair_ou_cnt[k] > 0},
        'peo': {k: round(pair_eo_ok[k]/pair_eo_cnt[k]*100) for k in pair_eo_cnt if pair_eo_cnt[k] > 0},
        'dou': digit_ou,
        'deo': digit_eo,
        'dir': {k: round(dir_digit_over[k]/dir_digit_total[k]*100) for k in dir_digit_total if dir_digit_total[k] > 0},
    }

# Output compact JS
print("// DIGIT PROBABILITY TABLES (generated from 15s OHLC data)")
print("// Each value = P(outcome | condition) * 100")
print("G.DIGIT_PROBS = " + json.dumps(all_data, separators=(',',':')) + ";")
print()
print("// Lookup example:")
print("// G.DIGIT_PROBS['R_50'].dou[3] -> P(OVER | curr_digit=3)")
print("// G.DIGIT_PROBS['R_50'].pou['UU'] -> P(OVER | last_two=U,U)")
print("// G.DIGIT_PROBS['R_50'].dir['up'] -> P(OVER | candle_up)")

# Also output aggregate (average across all markets)
agg_dou = [0]*10
agg_dou_cnt = [0]*10
agg_deo = [0]*10
agg_deo_cnt = [0]*10
agg_ou = {'O':0,'U':0}
agg_eo = {'E':0,'D':0}
agg_pou = defaultdict(list)
agg_peo = defaultdict(list)

for sym, data in all_data.items():
    for d in range(10):
        if d in data['dou']:
            agg_dou[d] += data['dou'][d]
            agg_dou_cnt[d] += 1
        if d in data['deo']:
            agg_deo[d] += data['deo'][d]
            agg_deo_cnt[d] += 1
    for k, v in data['ou'].items():
        agg_ou[k] += v
    for k, v in data['eo'].items():
        agg_eo[k] += v
    for k, v in data['pou'].items():
        agg_pou[k].append(v)
    for k, v in data['peo'].items():
        agg_peo[k].append(v)

avg_dou = {str(d): round(agg_dou[d]/agg_dou_cnt[d]) for d in range(10) if agg_dou_cnt[d] > 0}
avg_deo = {str(d): round(agg_deo[d]/agg_deo_cnt[d]) for d in range(10) if agg_deo_cnt[d] > 0}
avg_ou = {k: round(v/len(all_data)) for k, v in agg_ou.items()}
avg_eo = {k: round(v/len(all_data)) for k, v in agg_eo.items()}
avg_pou = {k: round(sum(v)/len(v)) for k, v in agg_pou.items() if len(v) >= 5}
avg_peo = {k: round(sum(v)/len(v)) for k, v in agg_peo.items() if len(v) >= 5}

print()
print("// AGGREGATE (average across all markets)")
print(f"const DIGIT_AVG = {{ dou:{avg_dou}, deo:{avg_deo}, ou:{avg_ou}, eo:{avg_eo}, pou:{avg_pou}, peo:{avg_peo} }};")
