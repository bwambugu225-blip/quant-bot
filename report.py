import json

with open(r'C:\Users\b0231\Desktop\step master\backtest_results.json') as f:
    data = json.load(f)

# Deduplicate: keep best WR per (market, strategy)
best = {}
for r in data:
    key = (r['market'], r['strategy'])
    if key not in best or r['win_rate'] > best[key]['win_rate'] or (r['win_rate'] == best[key]['win_rate'] and r['trades'] > best[key]['trades']):
        best[key] = r
results = sorted(best.values(), key=lambda x: -x['win_rate'])

print()
print("=" * 70)
print("  TOP RESULTS (deduplicated, >=30 trades)")
print("=" * 70)
print(f"  {'Market':<10} {'Strategy':<8} {'WR%':<8} {'Trades':<8} {'Rate%':<8}")
print(f"  {'-'*45}")
for r in results:
    if r['trades'] >= 30:
        print(f"  {r['market']:<10} {r['strategy']:<8} {r['win_rate']:<8.1f} {r['trades']:<8} {r['signal_rate']:<8}")

print()
print("=" * 70)
print("  BEST STRATEGY PER MARKET (>=30 trades)")
print("=" * 70)
print(f"  {'Market':<10} {'Best':<10} {'WR%':<8} {'Trades':<8} {'2nd Best':<12} {'3rd Best':<12}")
print(f"  {'-'*55}")
markets = ['R_10','R_25','R_50','R_75','R_100','1HZ10V','1HZ25V','1HZ50V','1HZ75V','1HZ100V']
for m in markets:
    mres = [r for r in results if r['market']==m and r['trades']>=30]
    mres.sort(key=lambda x: -x['win_rate'])
    if mres:
        b1 = mres[0]
        b2 = mres[1] if len(mres)>1 else None
        b3 = mres[2] if len(mres)>2 else None
        s2 = f"{b2['strategy']} {b2['win_rate']}%" if b2 else '---'
        s3 = f"{b3['strategy']} {b3['win_rate']}%" if b3 else '---'
        print(f"  {m:<10} {b1['strategy']:<10} {b1['win_rate']:<8.1f} {b1['trades']:<8} {s2:<12} {s3:<12}")

print()
print("=" * 70)
print("  RAW WR (no confidence filter) - per strategy across all markets")
print("=" * 70)
# For each strategy, show avg WR weighted by trades
strat_data = {}
for r in results:
    s = r['strategy']
    if s not in strat_data: strat_data[s] = {'wins':0,'total':0,'markets':[]}
    w = r['win_rate'] * r['trades'] / 100
    strat_data[s]['wins'] += w
    strat_data[s]['total'] += r['trades']
    strat_data[s]['markets'].append(r['market'])
for s, d in sorted(strat_data.items(), key=lambda x: -x[1]['wins']/x[1]['total']*100 if x[1]['total']>0 else 0):
    avg_wr = round(d['wins']/d['total']*100, 1) if d['total']>0 else 0
    print(f"  {s:<8} {avg_wr:<8.1f}% across {d['total']:<5} trades on {len(d['markets'])} markets")
