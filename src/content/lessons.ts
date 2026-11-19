/**
 * M1 coding lessons — L1 batch (lessons 1-5), content adapted from the TRAE
 * design (reviewed & adopted 2026-11-19). English content per plan §4.6.
 * Pedagogy: no forward references (functions only from lesson 3; no `if` in
 * lesson 2), decimal-return convention throughout, hints give concepts not code.
 */

export type LessonStep = {
  title: string;
  explain: string;
  starter: string;
  expected: string;
  hint?: string;
};

export type Lesson = {
  n: number;
  title: string;
  steps: LessonStep[];
};

export const LESSONS: Lesson[] = [
  {
    n: 1,
    title: 'Variables, Printing & Reading Errors',
    steps: [
      {
        title: 'Say something',
        explain:
          'print() sends text to the console, and text must be wrapped in quotes. Press Run — the code prints the greeting "Hello, QFS!". Then press Check: it compares your output with the expected output. (Trying changing the text between the quotes to anything you like, then run again to see the difference.)',
        starter: 'print("Hello, QFS!")\n',
        expected: 'Hello, QFS!',
        hint: 'The expected output for Check is "Hello, QFS!" — restore it before pressing Check.'
      },
      {
        title: 'Numbers and variables',
        explain:
          'A variable is a name for a value — here, the price of one share (in dollars) and the number of shares you hold. Print the total value of the position: how many dollars are these 200 shares worth altogether?',
        starter:
          'price = 12.5      # dollars per share\nquantity = 200    # shares\n\n# TODO: print the total value of the position\n',
        expected: '2500.0',
        hint: 'Which arithmetic operation combines "price per share" with "number of shares"?'
      },
      {
        title: 'Assignment and updating',
        explain:
          'The = sign means "assign", not "equals" in the math sense: the right side is computed first, then stored into the name on the left. That is why a variable can appear on both sides. Update the price by 5 dollars and print it.',
        starter:
          'price = 100.0\n\n# TODO: add 5 to price (assign price = price + 5), then print price\n',
        expected: '105.0',
        hint: 'The new value overwrites the old one — after the update line, price holds 105.0.'
      },
      {
        title: 'Values have types',
        explain:
          'Every value has a type: int (whole numbers), float (decimals), str (text in quotes). type() tells you which. Print the types of the ticker, the share count and the price — separated by spaces in one print call.',
        starter:
          'ticker = "0700.HK"\nshares = 200\nprice = 12.5\n\n# TODO: print type(ticker), type(shares) and type(price) in one print()\n',
        expected: "<class 'str'> <class 'int'> <class 'float'>",
        hint: 'print(type(a), type(b), type(c)) — commas print the values separated by spaces.'
      },
      {
        title: 'Your first return — decimal and percent',
        explain:
          'A return measures a price change relative to the start. Convention on this platform: the decimal form (0.075 means 7.5%) and the percent form (7.5 means 7.5%). From the two prices below, compute return_decimal first, then return_percent from it, and print both (one per line).',
        starter:
          'old_price = 100.0\nnew_price = 107.5\n\n# TODO: return_decimal = (new - old) / old; return_percent = decimal * 100\n# print both, one per line\n',
        expected: '0.075\n7.5',
        hint: 'First the gain relative to the starting price (brackets!), then multiply by 100 for percent.'
      },
      {
        title: 'Reading an error',
        explain:
          'Errors are messages, not failures: read the LAST line first (the error type), then the line number. Run the code — it crashes with a NameError because a variable is misspelled. Read the message, fix the typo, make it print 100.0.',
        starter: 'price = 100.0\nprint(prcie)\n',
        expected: '100.0',
        hint: 'The error names the undefined name — make the spelling consistent everywhere.'
      },
      {
        title: 'Mini challenge — Percentage Return Calculator',
        explain:
          'Putting it together: given an entry and an exit price, print the decimal return and the percent return, one per line. No functions yet — a plain script is exactly right at this stage.',
        starter:
          'entry = 80.0\nexit_price = 90.0\n\n# TODO: print decimal return, then percent return\n',
        expected: '0.125\n12.5',
        hint: 'Same two lines as before: relative gain first, times 100 second.'
      }
    ]
  },
  {
    n: 2,
    title: 'Lists & Loops: Price Series',
    steps: [
      {
        title: 'A price series',
        explain:
          'A list is an ordered sequence of values — perfect for daily closing prices. Create the list below and print it.',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: print prices\n',
        expected: '[100, 110, 99, 108.9]',
        hint: 'print(prices) prints the whole list with brackets.'
      },
      {
        title: 'Indexing',
        explain:
          'Positions start at 0: prices[0] is the first day. Negative counts from the end: prices[-1] is the latest. Print the first, the third and the latest price in one line (separated by spaces).',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: print prices[0], prices[2] and prices[-1]\n',
        expected: '100 99 108.9',
        hint: 'Third day means index 2, not 3 — counting starts at zero.'
      },
      {
        title: 'Length and append',
        explain:
          'len() counts items; append() adds one item to the end of the SAME list. A new closing price arrived — add it, then print the new length.',
        starter:
          'prices = [100, 110, 99, 108.9]\nprices.append(120.0)\n\n# TODO: print the length of prices\n',
        expected: '5',
        hint: 'One function call gives the count of items.'
      },
      {
        title: 'Loop over prices',
        explain:
          'A for loop repeats once per item: "for price in prices:" takes each value in order. Print every price, one per line.',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: for price in prices: print(price)\n',
        expected: '100\n110\n99\n108.9',
        hint: 'The loop line ends with a colon; the body is indented.'
      },
      {
        title: 'Accumulate a result',
        explain:
          'A classic loop pattern: initialise a total BEFORE the loop, add each item INSIDE it. Compute the total of all prices, then the average (rounded to 4 decimals) — print both, one per line.',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: total = 0 before the loop; add each price inside it\n# print(total), then print(round(total / len(prices), 4))\n',
        expected: '417.9\n104.475',
        hint: 'Initialise outside, update inside — the order is the whole trick.'
      },
      {
        title: 'Track the running peak',
        explain:
          'A "running" value uses only current and past data — never the future. Update a peak with peak = max(peak, price) as the loop walks forward, then print the final peak.',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: peak = prices[0] before the loop\n# inside: peak = max(peak, price); after: print(peak)\n',
        expected: '110',
        hint: 'Each day asks: is today higher than the best so far? max() answers it.'
      },
      {
        title: 'Drawdown of each day',
        explain:
          'Drawdown = how far below the running peak: 1 - price / peak. On a monotonic rise it stays 0. Track the MAXIMUM drawdown so far (same max() pattern as the peak) and print it rounded to 4 decimals.',
        starter:
          'prices = [100, 110, 99, 108.9]\n\n# TODO: with running peak and drawdown = 1 - price / peak\n# track max_drawdown; print(round(max_drawdown, 4))\n',
        expected: '0.1',
        hint: 'Two running values side by side: the best-so-far price, and the worst-so-far fall from it.'
      },
      {
        title: 'Mini challenge — Maximum Drawdown',
        explain:
          'Full task: for the series below, the maximum drawdown is the deepest fall from a PREVIOUS peak (order matters: the peak must come before the trough). Compute it with the running-peak loop and print the value rounded to 4 decimals.',
        starter:
          'prices = [100, 120, 90, 110, 80, 130]\n\n# TODO: print(round(max_drawdown, 4))\n',
        expected: '0.3333',
        hint: 'The answer is a clean fraction: how far is 80 below the earlier peak of 120?'
      }
    ]
  },
  {
    n: 3,
    title: 'Functions & Conditionals',
    steps: [
      {
        title: 'Why functions?',
        explain:
          'A function is a named, reusable rule. The one below squares its input. Call it on 4 and print the result — you did not write the rule, you used it.',
        starter:
          'def square(x):\n    return x * x\n\n# TODO: print square(4)\n',
        expected: '16',
        hint: 'Call by name with the input in brackets.'
      },
      {
        title: 'Define your own',
        explain:
          'def names the function; the parameter x is the input; the indented body runs on each call. Write double(x) that returns twice the input, then print double(21).',
        starter:
          '# TODO: def double(x): return x * 2\n# then print(double(21))\n',
        expected: '42',
        hint: 'Three parts: def line with colon, indented return line, call line.'
      },
      {
        title: 'return vs print',
        explain:
          'print() only SHOWS a value; return hands it BACK to the caller, who can store and reuse it. The function below returns; capture its result into a variable y and print y.',
        starter:
          'def give(x):\n    return x * 2\n\n# TODO: y = give(5); print(y)\n',
        expected: '10',
        hint: 'The caller stores what comes back — assignment captures the returned value.'
      },
      {
        title: 'Comparisons and Booleans',
        explain:
          'Comparisons produce True/False (Booleans): >, <, >=, <=, ==. Note == compares, = assigns. Predict first, then print all three comparisons in one line.',
        starter:
          '# TODO: print(107.5 > 100, 100 == 100.0, "A" == "A")\n',
        expected: 'True True True',
        hint: '100 and 100.0 are equal in VALUE even though their types differ.'
      },
      {
        title: 'if / elif / else',
        explain:
          'Conditions are checked top to bottom; the first true branch runs, the rest are skipped. Classify a return as Positive / Negative / Flat and print the label.',
        starter:
          'r = 0.075\n\n# TODO: if r > 0: print("Positive") elif r < 0: ... else: ...\n',
        expected: 'Positive',
        hint: 'Three branches cover all cases; only one prints.'
      },
      {
        title: 'Boundary rules',
        explain:
          'Bull and bear labels conventionally use a 20% THRESHOLD on a broad index over two months or more — and whether 20.0% itself counts depends on >= vs >. Test the three edge inputs below in one print.',
        starter:
          '# after you build classify_regime in the next step, this will reuse it\n# TODO: define classify_regime first (next step preview):\n# threshold >= 0.20 Bull, <= -0.20 Bear, else Neutral\n# then print(classify_regime(0.2), classify_regime(-0.2), classify_regime(0.199999))\n',
        expected: 'Bull Bear Neutral',
        hint: 'Use >= and <= so exactly 20% counts; 0.199999 is just below the line.'
      },
      {
        title: 'Mini challenge — Bull/Bear Regime Classifier',
        explain:
          'Build the classifier as a function: input is a decimal return of a broad index over at least two months (a teaching rule, not a prediction model). Return "Bull" (>= 0.20), "Bear" (<= -0.20) or "Neutral" — then print its verdicts on 0.25, -0.10 and 0.0 in one line.',
        starter:
          '# TODO: def classify_regime(index_return): ...\n# print(classify_regime(0.25), classify_regime(-0.10), classify_regime(0.0))\n',
        expected: 'Bull Neutral Neutral',
        hint: 'Return the string, do not print inside the function — the caller prints.'
      }
    ]
  },
  {
    n: 4,
    title: 'NumPy: Vectorized Thinking',
    steps: [
      {
        title: 'From list to array',
        explain:
          'NumPy arrays are lists tuned for number-crunching: operations apply to every element at once. Convert the list to an array and print its type.',
        starter:
          'import numpy as np\n\nprices_list = [100.0, 110.0, 99.0, 108.9]\n# TODO: prices = np.array(prices_list); print(type(prices))\n',
        expected: "<class 'numpy.ndarray'>",
        hint: 'np.array(list) makes the array; type() reveals the class.'
      },
      {
        title: 'Element-wise operations',
        explain:
          'Array arithmetic happens element by element: prices / 100 divides EVERY price at once, no loop. Check the mean price of the array (one number, no loop written by you).',
        starter:
          'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n# TODO: print(prices.mean())\n',
        expected: '104.475',
        hint: 'Arrays carry their own methods: mean() averages all elements.'
      },
      {
        title: 'Slicing: today and yesterday',
        explain:
          'prices[1:] is "from the 2nd item to the end" (today\'s prices); prices[:-1] is "up to but excluding the last" (yesterday\'s prices). Both have length N-1. Print the lengths of the two slices in one line.',
        starter:
          'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\ntoday = prices[1:]\nyesterday = prices[:-1]\n# TODO: print(len(today), len(yesterday))\n',
        expected: '3 3',
        hint: 'Four prices means three today/yesterday pairs.'
      },
      {
        title: 'Align the pairs',
        explain:
          'Why those two slices? Each return needs TODAY paired with ITS yesterday: 110 with 100, 99 with 110, 108.9 with 99. Print each pair on its own line (today first, yesterday second).',
        starter:
          'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\ntoday = prices[1:]\nyesterday = prices[:-1]\n# TODO: for t, y in zip(today, yesterday): print(t, y)\n',
        expected: '110.0 100.0\n99.0 110.0\n108.9 99.0',
        hint: 'zip() walks two sequences side by side.'
      },
      {
        title: 'Vectorized returns',
        explain:
          'The whole idea in one line: today / yesterday - 1 computes ALL returns at once. Print each return rounded to 4 decimals, one per line (use round(float(r), 4) inside a loop for clean output).',
        starter:
          'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\nreturns = prices[1:] / prices[:-1] - 1\n# TODO: for r in returns: print(round(float(r), 4))\n',
        expected: '0.1\n-0.1\n0.1',
        hint: 'Rounding hides float noise (like 0.099999…) so outputs read clean.'
      },
      {
        title: 'Align the dates',
        explain:
          'N prices give N-1 returns — the first return belongs to the SECOND date (nothing to compare on day one). Print the dates that own the returns, space-separated in one line.',
        starter:
          'dates = ["Mon", "Tue", "Wed", "Thu"]\n# TODO: print(dates[1], dates[2], dates[3])\n',
        expected: 'Tue Wed Thu',
        hint: 'Skip the first date — it has no yesterday inside this window.'
      },
      {
        title: 'Loop vs vector — same answer',
        explain:
          'Cross-check lesson 2 thinking against today\'s one-liner: compute returns with a loop, and again with slicing; print both totals rounded to 4 decimals in one line — they must match.',
        starter:
          'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\nvec_total = float((prices[1:] / prices[:-1] - 1).sum())\n# TODO: print(round(loop_total, 4), round(vec_total, 4))\n',
        expected: '0.1 0.1',
        hint: 'Two different routes, one identical destination.'
      }
    ]
  },
  {
    n: 5,
    title: 'pandas I: Series, DataFrame & Real Data',
    steps: [
      {
        title: 'Series — labelled values',
        explain:
          'A Series is a one-dimensional column whose entries can carry LABELS (like dates) instead of bare positions. Create the Series below and print the Tuesday value by label.',
        starter:
          'import pandas as pd\n\ns = pd.Series([100.0, 110.0, 99.0, 108.9], index=["Mon", "Tue", "Wed", "Thu"])\n# TODO: print(s["Tue"])\n',
        expected: '110.0',
        hint: 'Square brackets work with labels, not just numbers.'
      },
      {
        title: 'DataFrame — a table',
        explain:
          'A DataFrame is a 2-D table: each column is a Series, all sharing one index. Build one from a dict of columns (the same structure pd.read_csv() returns from a file) and print its shape.',
        starter:
          'import pandas as pd\n\ndf = pd.DataFrame({\n    "Date": ["Wed", "Mon", "Thu"],\n    "Close": [99.0, 100.0, 108.9],\n    "Adj Close": [99.0, 100.0, 108.9],\n})\n# TODO: print(df.shape)\n',
        expected: '(3, 3)',
        hint: 'shape is (rows, columns).'
      },
      {
        title: 'Select a column',
        explain:
          'df["Adj Close"] pulls one column as a Series. We use ADJUSTED close throughout: splits and dividends make raw prices jump mechanically — adjusted prices keep returns honest. Print the adjusted-close column as a plain list.',
        starter:
          'import pandas as pd\n\ndf = pd.DataFrame({\n    "Date": ["Wed", "Mon", "Thu"],\n    "Close": [99.0, 100.0, 108.9],\n    "Adj Close": [99.0, 100.0, 108.9],\n})\n# TODO: print(df["Adj Close"].tolist())\n',
        expected: '[99.0, 100.0, 108.9]',
        hint: '.tolist() turns the Series into an ordinary Python list.'
      },
      {
        title: 'Inspect before calculating',
        explain:
          'Professional habit: inspect a new table BEFORE any math — head() peeks at rows, info() shows types and gaps, dtypes lists column types. (In this browser sandbox we build tables from cached data; with files you would use pd.read_csv("file.csv", parse_dates=["Date"]) first.) Print the row count and the highest adjusted close in one line.',
        starter:
          'import pandas as pd\n\ndf = pd.DataFrame({\n    "Date": ["Wed", "Mon", "Thu"],\n    "Adj Close": [99.0, 100.0, 108.9],\n})\n# TODO: print(len(df), df["Adj Close"].max())\n',
        expected: '3 108.9',
        hint: 'One gives the height of the table, the other the column maximum.'
      },
      {
        title: 'Sort by time',
        explain:
          'Returns only make sense in time order — the table above is deliberately shuffled. sort_values("Date") sorts by the values as they compare: plain strings sort ALPHABETICALLY (Mon < Thu < Wed here), which is why real pipelines use actual date types. Print the adjusted-close column of the SORTED table as a list and see the order it produces.',
        starter:
          'import pandas as pd\n\ndf = pd.DataFrame({\n    "Date": ["Wed", "Mon", "Thu"],\n    "Adj Close": [99.0, 100.0, 108.9],\n})\ndf = df.sort_values("Date")\n# TODO: print(df["Adj Close"].tolist())\n',
        expected: '[100.0, 108.9, 99.0]',
        hint: 'Alphabetical order of the three day names decides the row order — trace it by hand first.'
      },
      {
        title: 'pct_change() — built-in returns',
        explain:
          'pct_change() computes decimal returns for you: each value divided by the previous one, minus 1. With no previous value, the FIRST entry becomes NaN (not zero!) — "unknown", not "no change". Print the NaN pattern (as a list), then the first real return rounded to 4 decimals.',
        starter:
          'import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change()\n# TODO: print(r.isna().tolist()); print(round(float(r.iloc[1]), 4))\n',
        expected: '[True, False, False, False]\n0.1',
        hint: 'isna() flags the missing first return; iloc[1] is the first real one.'
      },
      {
        title: 'Standard deviation — which formula?',
        explain:
          'Volatility starts with the standard deviation of daily returns. Subtle trap: pandas .std() uses ddof=1 (sample, divide by N-1) by DEFAULT, while NumPy np.std() uses ddof=0 — always state which. Print the sample std of the returns, rounded to 4 decimals.',
        starter:
          'import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\n# TODO: print(round(float(r.std()), 4))   # ddof=1 is pandas default\n',
        expected: '0.1155',
        hint: 'dropna() first — NaN would poison the calculation.'
      },
      {
        title: 'Mini challenge — Annualized Volatility',
        explain:
          'Convention for daily stock data: annualize by multiplying the daily sample std by the square root of 252 trading days. It is a convention (assumes roughly independent daily moves) — remember it as an estimate, not a law. Print the annualized volatility rounded to 4 decimals.',
        starter:
          'import numpy as np\nimport pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\n# TODO: print(round(float(r.std() * np.sqrt(252)), 4))\n',
        expected: '1.833',
        hint: 'Daily spread (~0.1155) stretched by sqrt(252) ≈ 15.87.'
      }
    ]
  }
];

export const getLesson = (n: number): Lesson | undefined =>
  LESSONS.find((l) => l.n === n);

export const TOTAL_LESSONS = 8; // lessons 6-8 arrive with the L3 content batch
