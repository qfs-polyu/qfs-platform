"""Execute every coding-lesson reference answer and validate course content.

Input is a JSON object on stdin with LESSONS and LESSONS_ZH. The Node wrapper
loads the TypeScript source files so this audit always tests the real content.
Requires Python 3, NumPy, and pandas; no network access or project packages.
"""

import ast
import contextlib
import io
import json
import sys
import traceback


SOLUTIONS = {
    "1-1": 'print("Hello, QFS!")',
    "1-2": 'price = 12.5\nquantity = 200\nprint(price * quantity)',
    "1-3": 'price = 100.0\nprice = price + 5\nprint(price)',
    "1-4": 'ticker = "0700.HK"\nshares = 200\nprice = 12.5\nprint(type(ticker), type(shares), type(price))',
    "1-5": 'old_price = 100.0\nnew_price = 107.5\nreturn_decimal = (new_price - old_price) / old_price\nreturn_percent = return_decimal * 100\nprint(return_decimal)\nprint(return_percent)',
    "1-6": 'price = 100.0\nprint(price)',
    "1-7": 'cost = 60.0\nprice = 90.0\nr = (price - cost) / cost\nprint(r)\nprint(r * 100)',
    "1-8": 'old = 423.4\nnew = 383.6\nr = (new - old) / old\nprint(round(r, 4))\nprint(round(r * 100, 4))',
    "2-1": 'prices = [100, 110, 99, 108.9]\nprint(prices)',
    "2-2": 'prices = [100, 110, 99, 108.9]\nprint(prices[0], prices[2], prices[-1])',
    "2-3": 'prices = [100, 110, 99, 108.9]\nprices.append(120.0)\nprint(len(prices))',
    "2-4": 'prices = [100, 110, 99, 108.9]\nfor price in prices:\n    print(price)',
    "2-5": 'prices = [100, 110, 99, 108.9]\ntotal = 0\nfor price in prices:\n    total = total + price\nprint(total)\nprint(round(total / len(prices), 4))',
    "2-6": 'prices = [100, 110, 99, 108.9]\npeak = prices[0]\nfor price in prices:\n    peak = max(peak, price)\nprint(peak)',
    "2-7": 'prices = [100, 110, 99, 108.9]\npeak = prices[0]\nmax_dd = 0.0\nfor price in prices:\n    peak = max(peak, price)\n    dd = 1 - price / peak\n    max_dd = max(max_dd, dd)\nprint(round(max_dd, 4))',
    "2-8": 'prices = [100, 120, 90, 110, 80, 130]\npeak = prices[0]\nmax_dd = 0.0\nfor price in prices:\n    peak = max(peak, price)\n    dd = 1 - price / peak\n    max_dd = max(max_dd, dd)\nprint(round(max_dd, 4))',
    "2-9": 'prices = [423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]\npeak = prices[0]\nmax_dd = 0.0\nfor price in prices:\n    peak = max(peak, price)\n    dd = 1 - price / peak\n    max_dd = max(max_dd, dd)\nprint(round(max_dd, 4))',
    "3-1": 'def square(x):\n    return x * x\nprint(square(4))',
    "3-2": 'def double(x):\n    return 2 * x\nprint(double(21))',
    "3-3": 'def give(x):\n    return x + 1\ny = give(9)\nprint(y)',
    "3-4": 'print(5 > 3, 5 < 3, 5 == 5.0)',
    "3-5": 'r = 0.075\nif r > 0:\n    print("Positive")\nelif r < 0:\n    print("Negative")\nelse:\n    print("Flat")',
    "3-6": 'def check(x):\n    if x >= 10:\n        return "pass"\n    else:\n        return "fail"\nprint(check(10), check(9.99))',
    "3-7": 'def classify_regime(index_return):\n    if index_return >= 0.20:\n        return "Bull"\n    elif index_return <= -0.20:\n        return "Bear"\n    else:\n        return "Neutral"\nprint(classify_regime(0.25), classify_regime(-0.10), classify_regime(0.0))',
    "3-8": 'def classify_regime(index_return):\n    if index_return >= 0.20:\n        return "Bull"\n    elif index_return <= -0.20:\n        return "Bear"\n    else:\n        return "Neutral"\nprint(classify_regime(0.4802), classify_regime(-0.1705))',
    "4-1": 'import numpy as np\nprices_list = [100.0, 110.0, 99.0, 108.9]\nprices = np.array(prices_list)\nprint(type(prices))',
    "4-2": 'import numpy as np\nprices = np.array([100.0, 110.0, 99.0, 108.9])\nprint(prices.mean())',
    "4-3": 'import numpy as np\nprices = np.array([100.0, 110.0, 99.0, 108.9])\ntoday = prices[1:]\nyesterday = prices[:-1]\nprint(len(today), len(yesterday))',
    "4-4": 'import numpy as np\nprices = np.array([100.0, 110.0, 99.0, 108.9])\ntoday = prices[1:]\nyesterday = prices[:-1]\nfor t, y in zip(today, yesterday):\n    print(t, y)',
    "4-5": 'import numpy as np\nprices = np.array([100.0, 110.0, 99.0, 108.9])\nr = prices[1:] / prices[:-1] - 1\nfor value in r:\n    print(round(float(value), 4))',
    "4-6": 'dates = ["Mon", "Tue", "Wed", "Thu"]\nprint(*dates[1:])',
    "4-7": 'import numpy as np\nprices = np.array([10, 20, 30])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\nvec_total = float((prices[1:] / prices[:-1] - 1).sum())\nprint(round(loop_total, 4), round(vec_total, 4))',
    "4-8": 'import numpy as np\nprices = np.array([386.4, 385.2, 387.6, 377.6, 383.6])\nr = prices[1:] / prices[:-1] - 1\nfor value in r:\n    print(round(float(value), 4))',
    "5-1": 'import pandas as pd\ns = pd.Series([100.0, 110.0, 99.0, 108.9], index=["Mon", "Tue", "Wed", "Thu"])\nprint(s["Tue"])',
    "5-2": 'import pandas as pd\ndata = {"Date": ["Wed", "Mon", "Thu"], "Close": [99.0, 100.0, 108.9], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\nprint(df.shape)',
    "5-3": 'import pandas as pd\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\nprint(df["Adj Close"].tolist())',
    "5-4": 'import pandas as pd\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\nprint(len(df), df["Adj Close"].max())',
    "5-5": 'import pandas as pd\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\ndf = df.sort_values("Date")\nprint(df["Adj Close"].tolist())',
    "5-6": 'import pandas as pd\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change()\nprint(r.isna().tolist())\nprint(round(float(r.iloc[1]), 4))',
    "5-7": 'import pandas as pd\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\nprint(round(float(r.std()), 4))',
    "5-8": 'import numpy as np\nimport pandas as pd\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\nprint(round(float(r.std() * np.sqrt(252)), 4))',
    "5-9": 'import numpy as np\nimport pandas as pd\ncloses = [431.0, 421.2, 423.0, 428.2, 420.6, 411.4, 424.8, 425.8, 425.2, 423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]\nadj = pd.Series(closes)\nr = adj.pct_change().dropna()\nprint(round(float(r.std() * np.sqrt(252)), 4))',
    "6-1": 'import pandas as pd\ndates = pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"])\nprices = [100.0, 102.0, 101.0, 104.0]\nclose = pd.Series(prices, index=dates)\nprint(close.index.strftime("%Y-%m-%d").tolist())',
    "6-2": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08"]))\nprint(float(close.loc["2024-01-04"]))\nprint(close.loc["2024-01-03":"2024-01-05"].tolist())',
    "6-3": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08"]))\nprint(float(close.iloc[-1]))\nprint(close.iloc[1:4].tolist())',
    "6-4": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0, 106.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08", "2024-01-09"]))\nselected = close.loc[close > 103]\nprint(selected.index.strftime("%Y-%m-%d").tolist())\nprint(selected.tolist())',
    "6-5": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 104.0, 103.0, 106.0])\nma3 = close.rolling(3).mean()\nprint(ma3.isna().tolist())\nprint(round(float(ma3.iloc[-1]), 4))',
    "6-6": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntarget = (fast > slow).astype(int)\nprint(target.tolist())',
    "6-7": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11"]))\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntoday = (fast > slow).astype(int)\nyesterday = today.shift(1)\ngolden = (today == 1) & (yesterday == 0)\ndeath = (today == 0) & (yesterday == 1)\nprint(close.index[golden].strftime("%Y-%m-%d").tolist())\nprint(close.index[death].strftime("%Y-%m-%d").tolist())',
    "6-8": 'import pandas as pd\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90], index=pd.date_range("2024-01-02", periods=30, freq="B"))\nfast = close.rolling(5).mean()\nslow = close.rolling(20).mean()\ntoday = (fast > slow).astype(int)\nyesterday = today.shift(1)\ngolden = (today == 1) & (yesterday == 0)\ndeath = (today == 0) & (yesterday == 1)\nprint(close.index[golden].strftime("%Y-%m-%d").tolist())\nprint(close.index[death].strftime("%Y-%m-%d").tolist())',
    "7-1": 'import pandas as pd\ndf = pd.DataFrame({"Date": pd.to_datetime(["2024-01-30", "2024-01-31", "2024-02-01"]), "Return": [0.01, 0.03, -0.02]})\ndf["Month"] = df["Date"].dt.to_period("M").astype(str)\nprint(df["Month"].tolist())',
    "7-2": 'import pandas as pd\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\nmonthly_mean = df.groupby("Month")["Return"].mean()\nprint(monthly_mean.round(4).tolist())',
    "7-3": 'import pandas as pd\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\nsummary = df.groupby("Month").agg(Days=("Return", "count"), Mean=("Return", "mean"), Vol=("Return", "std"))\nfor row in summary.itertuples():\n    print(row.Index, row.Days, round(row.Mean, 4), round(row.Vol, 4))',
    "7-4": 'import pandas as pd\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\ndf["Growth"] = 1 + df["Return"]\nmonthly = df.groupby("Month")["Growth"].prod() - 1\nprint(monthly.round(4).tolist())',
    "7-5": 'import pandas as pd\nstock = pd.DataFrame({"Month": ["2024-01", "2024-02", "2024-03"], "Stock": [0.02, 0.05, -0.01]})\nmarket = pd.DataFrame({"Month": ["2024-01", "2024-03"], "Market": [0.01, 0.02]})\nmerged = stock.merge(market, on="Month", how="left", validate="one_to_one")\nprint(merged.shape)\nprint(merged["Market"].isna().tolist())',
    "7-6": 'import pandas as pd\nmerged = pd.DataFrame({"Month": ["2024-01", "2024-02", "2024-03"], "Stock": [0.02, 0.05, -0.01], "Market": [0.01, float("nan"), 0.02]})\nmerged["Active"] = merged["Stock"] - merged["Market"]\nprint(merged["Active"].isna().tolist())\nprint(round(float(merged["Active"].mean()), 4))',
    "7-7": 'import pandas as pd\nsummary = pd.DataFrame({"Month": ["Jan", "Feb", "Mar"], "Return": [0.03, -0.02, 0.01]})\nfor row in summary.itertuples(index=False):\n    blocks = "█" * int(round(abs(row.Return) * 100))\n    direction = "+" if row.Return >= 0 else "-"\n    print(row.Month, direction, blocks)',
    "7-8": 'import pandas as pd\nprices = pd.DataFrame({"Date": pd.to_datetime(["2024-01-30", "2024-01-31", "2024-02-01", "2024-02-02", "2024-02-05", "2024-02-06"]), "Stock": [100.0, 102.0, 101.0, 100.0, 101.0, 103.0], "Market": [200.0, 202.0, 201.0, 200.0, 202.0, 204.0]})\nprices["StockReturn"] = prices["Stock"].pct_change()\nprices["MarketReturn"] = prices["Market"].pct_change()\ndaily = prices.dropna().copy()\ndaily["Month"] = daily["Date"].dt.to_period("M").astype(str)\ndaily["GrowthStock"] = 1 + daily["StockReturn"]\ndaily["GrowthMarket"] = 1 + daily["MarketReturn"]\nstock_monthly = daily.groupby("Month")["GrowthStock"].prod() - 1\nmarket_monthly = daily.groupby("Month")["GrowthMarket"].prod() - 1\nmonthly = pd.concat([stock_monthly, market_monthly], axis=1)\nmonthly.columns = ["Stock", "Market"]\nmonthly["Active"] = monthly["Stock"] - monthly["Market"]\nfor row in monthly.itertuples():\n    print(row.Index, round(row.Stock, 4), round(row.Market, 4), round(row.Active, 4))',
    "8-1": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\nprint(target.tolist())\nprint(held.tolist())',
    "8-2": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\nasset_return = close.pct_change().fillna(0)\ngross_return = held * asset_return\nprint(held.tolist())\nprint(round(float(gross_return.sum()), 4))',
    "8-3": 'import pandas as pd\nheld = pd.Series([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])\nturnover = held.diff().abs().fillna(held.abs())\ntrades = int(turnover.sum())\nprint(turnover.tolist())\nprint(trades)',
    "8-4": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\ncost_rate = 0.001\nnet_return = gross_return - turnover * cost_rate\nprint(round(float((turnover * cost_rate).sum()), 4))\nprint(round(float(net_return.sum()), 4))',
    "8-5": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\nequity = 10000 * (1 + net_return).cumprod()\nprint(round(float(equity.iloc[-1]), 2))\nprint(round(float(equity.iloc[-1] / 10000 - 1), 4))',
    "8-6": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\nequity = 10000 * (1 + net_return).cumprod()\npeak = equity.cummax()\ndrawdown = 1 - equity / peak\nprint(round(float(drawdown.max()), 4))',
    "8-7": 'import pandas as pd\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ndef report(close, fast_n, slow_n, cost_rate):\n    target = (close.rolling(fast_n).mean() > close.rolling(slow_n).mean()).astype(int)\n    held = target.shift(1).fillna(0).astype(int)\n    turnover = held.diff().abs().fillna(held.abs())\n    net = held * close.pct_change().fillna(0) - turnover * cost_rate\n    equity = 10000 * (1 + net).cumprod()\n    drawdown = 1 - equity / equity.cummax()\n    return float(equity.iloc[-1] / 10000 - 1), float(drawdown.max()), int(turnover.sum())\nr, dd, trades = report(close, 2, 3, 0.001)\nprint(round(r, 4), round(dd, 4), trades)',
    "8-8": 'import pandas as pd\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90])\ndef report(close, fast_n, slow_n, cost_rate):\n    target = (close.rolling(fast_n).mean() > close.rolling(slow_n).mean()).astype(int)\n    held = target.shift(1).fillna(0).astype(int)\n    turnover = held.diff().abs().fillna(held.abs())\n    net = held * close.pct_change().fillna(0) - turnover * cost_rate\n    equity = 10000 * (1 + net).cumprod()\n    drawdown = 1 - equity / equity.cummax()\n    return float(equity.iloc[-1] / 10000 - 1), float(drawdown.max()), int(turnover.sum())\nfor fast_n, slow_n in [(3, 10), (5, 20), (8, 20)]:\n    r, dd, trades = report(close, fast_n, slow_n, 0.001)\n    print(f"{fast_n}/{slow_n}", round(r, 4), round(dd, 4), trades)\nbuy_hold_return = close.iloc[-1] / close.iloc[0] - 1\nbuy_hold_equity = 10000 * close / close.iloc[0]\nbuy_hold_dd = 1 - buy_hold_equity / buy_hold_equity.cummax()\nprint("BuyHold", round(float(buy_hold_return), 4), round(float(buy_hold_dd.max()), 4))',
}

# This worked example deliberately teaches students to read a TypeError.
EXPECTED_EXAMPLE_ERRORS = {"1-6": "TypeError"}


def execute(code):
    """Run code in an isolated namespace and capture its console output."""
    stdout = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout):
            exec(compile(code, "<lesson>", "exec"), {})
        return stdout.getvalue().strip(), ""
    except Exception:
        return stdout.getvalue().strip(), traceback.format_exc(limit=1)


def syntax_tree(code):
    return ast.dump(ast.parse(code), include_attributes=False)


def main():
    payload = json.load(sys.stdin)
    lessons = payload["lessons"]
    zh = payload["zh"]
    failures = []
    steps = []
    example_count = 0

    def fail(key, kind, expected, actual, error=""):
        failures.append((key, kind, expected, actual, error))

    lesson_numbers = [lesson["n"] for lesson in lessons]
    if len(lesson_numbers) != len(set(lesson_numbers)):
        fail("COURSE", "DUPLICATE LESSON NUMBER", "unique lesson numbers", lesson_numbers)
    if set(zh) != {str(n) for n in lesson_numbers}:
        fail("COURSE", "ZH LESSON KEYS", sorted(str(n) for n in lesson_numbers), sorted(zh))

    for lesson in lessons:
        n = lesson["n"]
        zh_lesson = zh.get(str(n), {})
        zh_steps = zh_lesson.get("steps", [])
        if not zh_lesson.get("title", "").strip():
            fail(f"L{n}", "ZH LESSON TITLE", "non-empty title", zh_lesson.get("title", ""))
        if len(zh_steps) != len(lesson["steps"]):
            fail(f"L{n}", "ZH STEP COUNT", len(lesson["steps"]), len(zh_steps))

        for i, step in enumerate(lesson["steps"]):
            key = f"{n}-{i + 1}"
            steps.append(key)
            example_count += 1
            zh_step = zh_steps[i] if i < len(zh_steps) else {}

            for field in ("title", "explain", "example", "starter", "expected"):
                if not step.get(field, "").strip():
                    fail(key, f"EN {field.upper()}", "non-empty content", step.get(field, ""))
            for field in ("explain", "starter", "hint"):
                if not zh_step.get(field, "").strip():
                    fail(key, f"ZH {field.upper()}", "non-empty content", zh_step.get(field, ""))

            solution = SOLUTIONS.get(key)
            if solution is None:
                fail(key, "MISSING SOLUTION", "reference solution", "none")
            else:
                actual, error = execute(solution)
                expected = step["expected"].strip()
                if error or actual != expected:
                    fail(key, "ANSWER", expected, actual, error)

            example, example_error = execute(step["example"])
            expected_error = EXPECTED_EXAMPLE_ERRORS.get(key)
            if expected_error:
                if expected_error not in example_error:
                    fail(key, "EXAMPLE", f"intentional {expected_error}", example, example_error)
            elif example_error:
                fail(key, "EXAMPLE", "runs without error", example, example_error)

            example_lines = step["example"].splitlines()
            line_count = len(example_lines)
            for lang, notes in (
                ("EN", step.get("exampleNotes", {})),
                ("ZH", zh_step.get("exampleNotes", {})),
            ):
                for raw_index, note in notes.items():
                    try:
                        index = int(raw_index)
                    except (TypeError, ValueError):
                        fail(key, f"{lang} NOTE INDEX", "integer line index", raw_index)
                        continue
                    if not 0 <= index < line_count:
                        fail(key, f"{lang} NOTE INDEX", f"0..{line_count - 1}", index)
                    elif not example_lines[index].strip():
                        fail(key, f"{lang} NOTE ON BLANK LINE", "annotated code line", index)
                    if not str(note).strip():
                        fail(key, f"{lang} EMPTY NOTE", "non-empty annotation", note)

            if zh_step.get("starter"):
                try:
                    en_tree = syntax_tree(step["starter"])
                    zh_tree = syntax_tree(zh_step["starter"])
                    if en_tree != zh_tree:
                        fail(
                            key,
                            "ZH STARTER CODE",
                            "same executable code as English",
                            "different Python syntax tree",
                        )
                except SyntaxError as error:
                    fail(key, "STARTER SYNTAX", "valid Python", str(error))

    missing_solutions = sorted(set(steps) - set(SOLUTIONS))
    extra_solutions = sorted(set(SOLUTIONS) - set(steps))
    for key in extra_solutions:
        fail(key, "EXTRA SOLUTION", "no orphan solution", "solution has no course step")

    print(f"Audited {len(steps)} steps and {example_count} worked examples")
    print(f"Missing solutions: {missing_solutions}; extra solutions: {extra_solutions}")
    print(f"Failures: {len(failures)}")
    for key, kind, expected, actual, error in failures:
        print(f"\n[{key}] {kind}\nEXPECTED: {expected!r}\nACTUAL:   {actual!r}")
        if error:
            print(error.strip())

    return 1 if failures or missing_solutions or extra_solutions else 0


if __name__ == "__main__":
    raise SystemExit(main())
