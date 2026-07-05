import json
from pathlib import Path

dir = Path(r"C:\Users\b0231\Desktop\step master")

# Load all backtest results
all_data = []
for f in sorted(dir.glob("backtest_R_*.json")):
    with open(f) as fh:
        data = json.load(fh)
    m = f.stem.replace("backtest_", "")
    for r in data:
        r["market"] = m
        all_data.append(r)

# Also load combined results if exists
combined = dir / "backtest_results.json"
if combined.exists():
    with open(combined) as fh:
        combined_data = json.load(fh)

# Find elite per market
print("=== BEST PER MARKET (>=10 trades) ===")
for m in sorted(set(r["market"] for r in all_data)):
    mrs = [r for r in all_data if r["market"] == m and r.get("t", 0) >= 10]
    mrs.sort(key=lambda x: -x["wr"])
    print(f"\n{m}:")
    for r in mrs[:8]:
        print(f"  {r['s']:<35} WR={r['wr']}% T={r['t']} W={r.get('w','')}")

# Find combos with 75%+
print("\n\n=== ELITE COMBOS (>=70% WR, >=10 trades) ===")
elite = [r for r in all_data if r.get("wr", 0) >= 70 and r.get("t", 0) >= 10]
elite.sort(key=lambda x: -x["wr"])
for r in elite:
    print(f"  {r['market']:<12} {r['s']:<35} WR={r['wr']}% T={r['t']}")

# Find combos with 65%+ and >=50 trades
print("\n\n=== ROBUST (>=65% WR, >=50 trades) ===")
robust = [r for r in all_data if r.get("wr", 0) >= 65 and r.get("t", 0) >= 50]
robust.sort(key=lambda x: -x["wr"])
for r in robust:
    print(f"  {r['market']:<12} {r['s']:<35} WR={r['wr']}% T={r['t']}")
