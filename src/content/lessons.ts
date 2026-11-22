/**
 * M1 coding lessons — L1 batch (lessons 1-5), content adapted from the TRAE
 * design (reviewed & adopted 2026-11-19). English content per plan §4.6.
 * Pedagogy: no forward references (functions only from lesson 3; no `if` in
 * lesson 2), decimal-return convention throughout, hints give concepts not code.
 */

export type LessonStep = {
  title: string;
  explain: string;
  /** true when the task itself is to print a fixed literal (step 1.1) */
  allowLiteral?: boolean;
  /** worked example shown before the task (different numbers than the task) */
  example: string;
  /** per-line annotations for the example: line index -> explanation */
  exampleNotes?: Record<number, string>;
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
        allowLiteral: true,
        example: "print(\"Hello, world!\")\nprint(\"Hong Kong\")\n",
        exampleNotes: {"0": "print() shows whatever is inside the brackets; text must be wrapped in quotes", "1": "a second print() starts a NEW line automatically"},
        explain:
          "print() is your outlet to the world: whatever sits between its brackets is written to the console \u2014 the output panel below your editor. Text (a string) must be wrapped in quotes so Python treats it as words, not as a variable name. The brackets () make it a CALL: you are telling Python to run the print action now. The checker compares your console output with the expected output, so match the text exactly \u2014 capitals and punctuation included.",
        starter: "# Task: make this program print the greeting: Hello, QFS!\n",
        expected: 'Hello, QFS!',
        hint: 'The expected output for Check is "Hello, QFS!" — restore it before pressing Check.'
      },
      {
        title: 'Numbers and variables',
        example: "apples = 3\nprice_per_apple = 2.5\nprint(apples * price_per_apple)\n",
        exampleNotes: {"0": "create a variable named apples; a whole number is an int", "1": "a decimal value is a float — the dot makes it one", "2": "* multiplies the two variables; print() shows the result: 7.5"},
        explain:
          "A variable is a NAME that points to a value \u2014 like a labelled box: price = 12.5 puts 12.5 into a box labelled price, and from then on the name price hands Python the value. Python knows everyday arithmetic: + - * / work as in maths, with * binding tighter than +. Inside an expression, every variable is replaced by its value before the arithmetic runs. Task in words: compute the total worth of the position and print it.",
        starter:
          "price = 12.5      # dollars per share\nquantity = 200    # shares\n\n# Task: print how many dollars these 200 shares are worth altogether\n",
        expected: '2500.0',
        hint: 'Which arithmetic operation combines "price per share" with "number of shares"?'
      },
      {
        title: 'Assignment and updating',
        example: "score = 90\nscore = score + 10\nprint(score)\n",
        exampleNotes: {"0": "create score with 90", "1": "RIGHT side runs first: read old score, add 10, store it back into score", "2": "score is now 100 — assignment overwrote the old value"},
        explain:
          "The = sign does NOT mean equals \u2014 it means STORE INTO. Python runs the RIGHT side first, then stores the result into the name on the LEFT. That is why price = price + 5 is legal and powerful: it reads the OLD value, adds 5, and overwrites price with the result. This update pattern (read old, compute, overwrite) is the engine behind every running total in this course. Task: apply it once.",
        starter:
          "price = 100.0\n\n# Task: increase price by 5 dollars, then print the new price\n",
        expected: '105.0',
        hint: 'The new value overwrites the old one — after the update line, price holds 105.0.'
      },
      {
        title: 'Values have types',
        example: "print(type(\"HK\"), type(7), type(7.0))\n",
        exampleNotes: {"0": "type() reveals a value's type; commas show three results on ONE line, space-separated"},
        explain:
          "Every value has a TYPE: the ticker is a str (text), 200 is an int (whole number), 12.5 is a float (decimal). Types matter because operations behave differently on them: joining two strings is legal, adding a string to a number is a TypeError. New syntax: type(x) RETURNS the type of x as a value you can print; and print(a, b, c) with COMMAS prints several values on ONE line, space-separated. One print call, three types, in order.",
        starter:
          "ticker = \"0700.HK\"\nshares = 200\nprice = 12.5\n\n# Task: print the type of each of the three values, in order, in ONE print call\n",
        expected: "<class 'str'> <class 'int'> <class 'float'>",
        hint: 'print(type(a), type(b), type(c)) — commas print the values separated by spaces.'
      },
      {
        title: 'Your first return — decimal and percent',
        example: "cost = 40.0\nsale = 50.0\nr = (sale - cost) / cost\nprint(r)\nprint(r * 100)\n",
        exampleNotes: {"0": "the entry (buy) price", "1": "the exit (sell) price", "2": "gain divided by the STARTING price — brackets force subtraction first: the decimal return", "3": "0.25 — the decimal form (means 25%)", "4": "multiply by 100 to state it as a percent: 25.0"},
        explain:
          "A return measures a price CHANGE relative to where you started \u2014 the most important number in this course. Logic: first the GAIN (new minus old), then scale by the STARTING price (divide by old), because a $5 gain on a $100 stock means something very different from $5 on a $1000 stock. Convention: decimal 0.075 MEANS 7.5%, and the percent form 7.5 also means 7.5% \u2014 compute the decimal first, then multiply by 100. Mind operator order: without brackets, division would bind to new_price alone. Two print calls give two lines.",
        starter:
          "old_price = 100.0\nnew_price = 107.5\n\n# Task: create return_decimal and return_percent, then print them, one per line\n",
        expected: '0.075\n7.5',
        hint: 'First the gain relative to the starting price (brackets!), then multiply by 100 for percent.'
      },
      {
        title: 'Reading an error',
        example: "word = \"hello\"\nprint(word + 1)\n",
        exampleNotes: {"0": "a string variable — text in quotes", "1": "string + number has no meaning in Python, so it crashes: read the LAST line of the error first (TypeError)"},
        explain:
          "Errors are messages, not failures \u2014 professionals read them constantly. Reading order: the LAST line names the error TYPE (here NameError \u2014 Python met a name it does not know); the lines above show WHERE (line number). This program crashes because the variable was defined as price but used as prcie: spelling must match EXACTLY, every character. Task: fix the name so the program prints 100.0. Habit: never guess \u2014 let the error tell you which name, which line.",
        starter: "price = 100.0\nprint(prcie)\n",
        expected: '100.0',
        hint: 'The error names the undefined name — make the spelling consistent everywhere.'
      },
      {
        title: 'Mini challenge — Percentage Return Calculator',
        example: "cost = 60.0\nprice = 90.0\nr = (price - cost) / cost\nprint(r)\nprint(r * 100)\n",
        exampleNotes: {"0": "entry price", "1": "exit price", "2": "decimal return: gain relative to entry", "3": "0.5", "4": "50.0 — the percent form"},
        explain:
          "The whole lesson in one place: variables hold the buy and sell prices; the gain is measured relative to the entry; decimal first, percent second. This is exactly the calculation a daily P&L (profit-and-loss) report runs on every position. No new syntax \u2014 structure it yourself from a blank editor.",
        starter:
          "cost = 60.0\nprice = 90.0\n\n# Task: print the decimal return, then the percent return\n",
        expected: '0.125\n12.5',
        hint: 'Same two lines as before: relative gain first, times 100 second.'
      },
      {
        title: "Real data \u2014 a real Tencent fortnight",
        explain: "Same return logic on real prices, plus one new tool for display: round(x, 4) RETURNS a copy of x cut to 4 decimal places (x itself is untouched). Reports round for humans \u2014 0.0940 reads better than 0.09400566. Compute from the variables; round only at the print stage; decimal line first, percent line second.",
        example: "old = 431.0   # 2026-09-30 real close\nnew = 417.8   # 2026-10-16 real close\nr = (new - old) / old\nprint(round(r, 4))\nprint(round(r * 100, 4))\n",
        exampleNotes: {"0": "entry price", "1": "exit price", "2": "decimal return: gain relative to entry", "3": "0.5", "4": "50.0 — the percent form"},
        starter: "old = 423.4   # real close, 2026-10-14\nnew = 383.6   # real close, 2026-10-30\n\n# Task: print the real holding-period return \u2014 decimal then percent, both rounded to 4\n",
        expected: "-0.094\n-9.4001",
        hint: "Same two lines as the lesson \u2014 with the real prices.",
      }
    ]
  },
  {
    n: 2,
    title: 'Lists & Loops: Price Series',
    steps: [
      {
        title: 'A price series',
        example: "temps = [20, 25, 31]\nprint(temps)\n",
        exampleNotes: {"0": "square brackets create a list; commas separate items IN ORDER — order is the data", "1": "printing a list shows every item between brackets"},
        explain:
          "A list is Python's ordered container: square brackets, comma-separated items. Order is not decoration \u2014 position 0 is the OLDEST day; the sequence IS the data, and every technique in lessons 2\u20135 (loops, slicing, arrays, Series) starts from exactly this structure. print(prices) shows all items with their brackets.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: print the whole series\n",
        expected: '[100, 110, 99, 108.9]',
        hint: 'print(prices) prints the whole list with brackets.'
      },
      {
        title: 'Indexing',
        example: "temps = [20, 25, 31]\nprint(temps[0], temps[-1])\n",
        exampleNotes: {"1": "index 0 = first item; -1 = last item. Counting starts at ZERO, so 'the third day' is index 2"},
        explain:
          "Every item has an INDEX \u2014 its position number \u2014 and Python counts from ZERO: prices[0] is the first day, prices[1] the second, prices[2] the third. The off-by-one habit trips everyone at first: the THIRD item lives at index 2. Negative indices count from the END: prices[-1] is the latest price. Square brackets after the list name perform the selection; commas in print() keep everything on one line.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: print the first, the third and the latest price \u2014 all in one line\n",
        expected: '100 99 108.9',
        hint: 'Third day means index 2, not 3 — counting starts at zero.'
      },
      {
        title: 'Length and append',
        example: "letters = [\"a\", \"b\"]\nletters.append(\"c\")\nprint(len(letters))\n",
        exampleNotes: {"0": "a two-item list", "1": "append() adds one item to the END of the SAME list — no new variable needed", "2": "len() counts the items: now 3"},
        explain:
          "Two everyday tools. len(x) RETURNS the count of items. list.append(value) ADDS one item to the END of that same list \u2014 note the DOT syntax: the action belongs to the list itself (this dot pattern returns everywhere in pandas). The append line is given; after it, the series holds five closes. Your job: count them.",
        starter:
          "prices = [100, 110, 99, 108.9]\nprices.append(120.0)   # a new close arrived\n\n# Task: print how many items the series now has\n",
        expected: '5',
        hint: 'One function call gives the count of items.'
      },
      {
        title: 'Loop over prices',
        example: "for n in [1, 2, 3]:\n    print(n)\n",
        exampleNotes: {"0": "the loop header: take items one at a time, each round named n. Colon + indentation start the body", "1": "the indented body runs once per item: 1, then 2, then 3"},
        explain:
          "A for loop = do the same thing once per item. Structure: the header for price in prices: takes items one at a time, each round named price; the colon opens the body; the body is INDENTED (4 spaces) and runs once per item, in order. Indentation is not cosmetic \u2014 it IS Python's block structure. Each print(price) emits one line, so four items produce four lines.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: print every price, one per line\n",
        expected: '100\n110\n99\n108.9',
        hint: 'The loop line ends with a colon; the body is indented.'
      },
      {
        title: 'Accumulate a result',
        example: "nums = [2, 4, 6]\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total)\n",
        exampleNotes: {"0": "the data", "1": "INITIALISE the accumulator BEFORE the loop — it starts at zero", "2": "walk the list in order", "3": "inside the loop: add the current item into total, overwriting it each round", "4": "after the loop ends: the sum of every item"},
        explain:
          "The accumulator \u2014 the most-used pattern in data code. Logic: create total = 0 BEFORE the loop (it must exist before anyone adds to it); INSIDE the loop, total = total + price applies the update pattern from lesson 1 once per item. The order is the whole trick: initialise outside, update inside \u2014 swap them and you erase your progress every round. For the average, divide the final total by the count (len helps) and round for display.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: print the total of all prices, then the average rounded to 4 decimals\n",
        expected: '417.9\n104.475',
        hint: 'Initialise outside, update inside — the order is the whole trick.'
      },
      {
        title: 'Track the running peak',
        example: "vals = [3, 9, 5]\npeak = vals[0]\nfor v in vals:\n    peak = max(peak, v)\nprint(peak)\n",
        exampleNotes: {"0": "the data", "1": "the running peak STARTS at the first value — a running value may only use current and PAST data", "2": "walk forward in time", "3": "max(peak, v): keep whichever is larger — the best-so-far price", "4": "9: the highest price seen by the end"},
        explain:
          "A running value may only use CURRENT and PAST data \u2014 never peek ahead (that rule is what keeps backtests honest). Logic: start peak at the FIRST price; each day ask whether today beats the record. New syntax: max(a, b) RETURNS the larger of two values, so peak = max(peak, price) keeps today's price if it beats the record, else keeps the record. Initialise before the loop, update inside, print after it ends.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: track the running peak and print the final peak\n",
        expected: '110',
        hint: 'Each day asks: is today higher than the best so far? max() answers it.'
      },
      {
        title: 'Drawdown of each day',
        example: "vals = [3, 9, 5]\npeak = vals[0]\nmax_dd = 0.0\nfor v in vals:\n    peak = max(peak, v)\n    dd = 1 - v / peak\n    max_dd = max(max_dd, dd)\nprint(round(max_dd, 4))\n",
        exampleNotes: {"0": "the data", "1": "running peak, same as before", "2": "a SECOND running value: the deepest fall so far, starting at zero", "3": "walk forward", "4": "update the best-so-far price FIRST", "5": "how far the current price sits below the running peak, as a fraction (0 = at the peak)", "6": "keep the deeper of the two falls", "7": "round(..., 4) prints cleanly: 5 is 4/9 below the peak of 9, about 0.4444"},
        explain:
          "Drawdown = how far below the running peak, as a fraction: 1 - price / peak (zero means sitting at the peak). Two running values walk together \u2014 peak only ratchets UP, drawdown only ratchets DEEPER \u2014 and order inside the loop matters: update the peak FIRST, then measure today's fall against it. The deepest fall by the end is the maximum drawdown, the risk number every fund reports daily.",
        starter:
          "prices = [100, 110, 99, 108.9]\n\n# Task: print the maximum drawdown of this walk, rounded to 4 decimals\n",
        expected: '0.1',
        hint: 'Two running values side by side: the best-so-far price, and the worst-so-far fall from it.'
      },
      {
        title: 'Mini challenge — Maximum Drawdown',
        example: "vals = [50, 100, 40, 80]\npeak = vals[0]\nmax_dd = 0.0\nfor v in vals:\n    peak = max(peak, v)\n    dd = 1 - v / peak\n    max_dd = max(max_dd, dd)\nprint(round(max_dd, 4))\n",
        exampleNotes: {"0": "the data: rises to 100, crashes to 40, recovers to 80", "1": "running peak starts at the first price", "2": "deepest fall so far", "3": "walk forward in time", "4": "peak becomes 100 before the crash", "5": "at 40: 1 - 40/100 = 0.6 — the trough is measured against the EARLIER peak", "6": "0.6 is the maximum drawdown of this path", "7": "clean print: 0.6"},
        explain:
          "A path with a story: rally to 120, crash to 90, recover, crash deeper to 80, surge to 130. The trap: the trough (80) must be measured against the peak that came BEFORE it (120) \u2014 not against the starting price (100) and not against anything after it. A correctly ordered running-peak loop takes care of the sequencing for you. Same code as the last step, only new numbers.",
        starter:
          "prices = [100, 120, 90, 110, 80, 130]\n\n# Task: print the maximum drawdown of this path, rounded to 4 decimals\n",
        expected: '0.3333',
        hint: 'The answer is a clean fraction: how far is 80 below the earlier peak of 120?'
      },
      {
        title: "Real data \u2014 drawdown check on a rough fortnight",
        explain: "Twelve REAL daily closes from a rough Tencent fortnight. The identical running-peak loop from lesson 2, now on market data: ratcheting peak, daily drawdown fraction, deepest fall. That final number (~11%) is what a risk system recomputes every night for every portfolio it watches. Same code \u2014 the stakes just became real.",
        example: "prices = [431.0, 421.2, 423.0]   # three real closes, late Sep 2026\npeak = prices[0]\nmax_dd = 0.0\nfor p in prices:\n    peak = max(peak, p)\n    max_dd = max(max_dd, 1 - p / peak)\nprint(round(max_dd, 4))\n",
        exampleNotes: {"2": "deepest fall so far", "6": "clean print: 0.6"},
        starter: "prices = [423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]  # real closes 2026-10-14..10-30\n\n# Task: print the real maximum drawdown of this fortnight, rounded to 4 decimals\n",
        expected: "0.1082",
        hint: "The identical loop from the challenge \u2014 only the numbers are real now.",
      }
    ]
  },
  {
    n: 3,
    title: 'Functions & Conditionals',
    steps: [
      {
        title: 'Why functions?',
        example: "def add10(x):\n    return x + 10\nprint(add10(5))\n",
        exampleNotes: {"0": "def DEFINES a function: name square, input slot x, colon starts the body", "1": "return sends the result back to whoever called", "2": "call with 4: body runs, 16 comes back"},
        explain:
          "A function is a named, reusable rule: define once, use forever. Two halves: the definition is GIVEN (def square(x): names it and opens the body); and CALLING square(4) runs that body with x set to 4. New syntax: return hands a value back to the caller \u2014 the call square(4) literally BECOMES 16 wherever it sits, so you can print it, store it, or pass it onward.",
        starter:
          "def square(x):\n    return x * x\n\n# Task: call square on the number 4 and print what comes back\n",
        expected: '16',
        hint: 'Call by name with the input in brackets.'
      },
      {
        title: 'Define your own',
        example: "def triple(x):\n    return 3 * x\nprint(triple(7))\n",
        exampleNotes: {"0": "your own function: name it triple, one parameter x", "1": "the body: one line computing what to give back", "2": "call it: 7 goes in, 21 comes out"},
        explain:
          "Now you write both halves. Anatomy of a definition: the def line (keyword def, a short lowercase name, the parameter slot in brackets, a colon), then the INDENTED body \u2014 here one return line that computes the answer. After the definition, double(21) runs the body with x = 21. Nothing here is new syntax \u2014 it is pieces you have used, assembled by you for the first time.",
        starter:
          "# Task: define a function double(x) that returns twice x, then print double(21)\n",
        expected: '42',
        hint: 'Three parts: def line with colon, indented return line, call line.'
      },
      {
        title: 'return vs print',
        example: "def f(x):\n    return x + 1\nresult = f(9)\nprint(result)\n",
        exampleNotes: {"0": "a tiny function", "1": "RETURN hands the value back to the caller — it does not show anything by itself", "2": "the caller can CAPTURE the returned value into a variable — that is the power of return", "3": "10 — reuse the stored result later as many times as you like"},
        explain:
          "The deepest beginner confusion, settled. print() only DISPLAYS a value to a human \u2014 after showing it, the value is gone. return hands the value BACK to the caller: the call site give(9) becomes 10, and 10 can be stored, reused, combined. So y = give(9) stores the returned 10 into y, and y stays usable afterwards. A function that prints but forgets to return leaves its caller with NOTHING (Python quietly returns None) \u2014 remember this for the classifier steps.",
        starter:
          "def give(x):\n    return x + 1\n\n# Task: capture what give(9) returns into a variable y, then print y\n",
        expected: '10',
        hint: 'The caller stores what comes back — assignment captures the returned value.'
      },
      {
        title: 'Comparisons and Booleans',
        example: "print(5 > 3, 5 < 3, 5 == 5.0)\n",
        exampleNotes: {"0": "comparisons produce True/False. NOTE: == COMPARES (one = assigns). 5 == 5.0 is True — same value even with different types"},
        explain:
          "Comparisons ASK questions, and the answer is a Boolean: True or False \u2014 a value type of its own. Operators: > < >= <= compare; == TESTS equality (two signs!). One = stores, two == ask \u2014 mixing them up is the classic bug. Subtlety: 5 == 5.0 is True, because equality compares VALUE, not type (int 5 and float 5.0 hold the same number). Booleans are the fuel that powers if-statements in the next step.",
        starter:
          "# Task: print three checks in one line \u2014 whether 5 is greater than 3, whether 5 is less than 3, and whether 5 equals 5.0\n",
        expected: 'True True True',
        hint: '100 and 100.0 are equal in VALUE even though their types differ.'
      },
      {
        title: 'if / elif / else',
        example: "temp = 31\nif temp > 30:\n    print(\"Hot\")\nelif temp > 20:\n    print(\"Warm\")\nelse:\n    print(\"Cool\")\n",
        exampleNotes: {"0": "the input to classify", "1": "conditions are tested TOP-DOWN; the first true branch runs and the rest are skipped", "2": "31 > 30 → this branch wins", "3": "elif = 'else if' — only reached when the if above was False", "4": "(skipped this time)", "5": "else catches everything the tests above did not", "6": "(skipped this time)"},
        explain:
          "Branching: run different code depending on a condition. Execution logic: conditions are tested TOP-DOWN; the FIRST true branch runs and the rest are skipped entirely. Structure mirrors the loop \u2014 header ending in a colon, indented body. elif (else-if) is reached only when everything above was False; else is the catch-all. Exactly ONE of the three prints will fire \u2014 that is the point of a classifier.",
        starter:
          "r = 0.075\n\n# Task: print \"Positive\" if r is above zero, \"Negative\" if below, and \"Flat\" if exactly zero\n",
        expected: 'Positive',
        hint: 'Three branches cover all cases; only one prints.'
      },
      {
        title: 'Boundary rules',
        example: "def check(x):\n    if x >= 10:\n        return \"pass\"\n    else:\n        return \"fail\"\nprint(check(10), check(9.99))\n",
        exampleNotes: {"0": "a threshold classifier", "1": ">= INCLUDES the boundary itself: exactly 10 passes", "2": "the branch's answer goes back via return", "3": "everything below 10", "4": "9.99 fails — just under the line", "5": "two calls in one print: results appear space-separated: pass fail"},
        explain:
          "Boundaries are where classifiers live or die: >= INCLUDES the boundary itself (exactly 10 passes), while > would exclude it. Professional discipline: write the boundary table FIRST \u2014 10 in, 9.999 out, 0 out \u2014 then code, then verify each row. Both branches RETURN a string (the function decides, the caller prints); two calls inside one print() show both verdicts on one line, space-separated.",
        starter:
          "# Task: write a function check(x) that returns \"pass\" when x is 10 or more, and \"fail\" otherwise; print check(10) and check(9.99) in one line\n",
        expected: 'Bull Bear Neutral',
        hint: 'Use >= and <= so exactly 20% counts; 0.199999 is just below the line.'
      },
      {
        title: 'Mini challenge — Bull/Bear Regime Classifier',
        example: "def zone(r):\n    if r >= 0.5:\n        return \"Strong\"\n    elif r <= -0.5:\n        return \"Weak\"\n    else:\n        return \"Mid\"\nprint(zone(0.5), zone(0.3))\n",
        exampleNotes: {"0": "same shape as the challenge, different thresholds", "1": "boundary included: 0.5 is Strong", "2": "…", "3": "symmetric lower boundary", "4": "…", "6": "between the lines", "7": "Strong Mid — 0.5 crosses the line, 0.3 stays inside"},
        explain:
          "Industry convention, teaching version: a broad market INDEX moving 20% or more over two months earns the Bull/Bear label \u2014 thresholds 0.20 and -0.20, boundaries INCLUDED, input a decimal return (0.25 means 25%; do not multiply again). Caveat that matters: the convention is about broad indexes \u2014 a single stock jumping 20% is NOT a bull market. Every branch returns; nothing is printed inside.",
        starter:
          "# Task: write classify_regime(index_return): \"Bull\" for +0.20 or above, \"Bear\" for -0.20 or below, otherwise \"Neutral\"; print its verdicts on 0.25, -0.10 and 0.0 in one line\n",
        expected: 'Bull Neutral Neutral',
        hint: 'Return the string, do not print inside the function — the caller prints.'
      },
      {
        title: "Real data \u2014 classifying Tencent's real two-month moves",
        explain: "Your classifier meets real history: Tencent really did rise +48.02% in two months in spring 2024, and really did fall -17.05% across autumn 2026. Even that savage real slump stays ABOVE the -0.20 line \u2014 the rule is deliberately strict, which is why the 2024 rally is the only Bull verdict you will see. One print line, two calls, two real verdicts.",
        example: "def zone(r):\n    if r >= 0.20:\n        return \"Strong\"\n    elif r <= -0.20:\n        return \"Weak\"\n    else:\n        return \"Mid\"\nprint(zone(0.4576), zone(-0.1141))   # two other REAL two-month windows (2024)\n",
        exampleNotes: {"0": "same shape as the challenge, different thresholds", "2": "…", "4": "…", "6": "between the lines"},
        starter: "# Task: reuse classify_regime on two REAL two-month moves of Tencent:\n# +0.4802 (2024-03-05 -> 2024-05-16) and -0.1705 (2026-08-28 -> 2026-10-29)\n# print both verdicts in one line\n",
        expected: "Bull Neutral",
        hint: "Only the giant 2024 rally crosses the +20% line; the 2026 slump stays above -20%.",
      }
    ]
  },
  {
    n: 4,
    title: 'NumPy: Vectorized Thinking',
    steps: [
      {
        title: 'From list to array',
        example: "import numpy as np\n\na = np.array([1.0, 2.0, 3.0])\nprint(type(a))\n",
        exampleNotes: {"0": "load the NumPy library under its universal nickname np"},
        explain:
          "NumPy is the number-crunching engine: arrays look like lists but do maths on ALL elements at once. New syntax, used in every numeric script you will ever write: import numpy as np loads the library under the universal nickname np; np.array(list) converts a list into an array. The import is given \u2014 your task is the conversion plus printing the type (ndarray proves it happened).",
        starter:
          "import numpy as np\n\nprices_list = [100.0, 110.0, 99.0, 108.9]\n\n# Task: convert prices_list into a NumPy array and print the array's type\n",
        expected: "<class 'numpy.ndarray'>",
        hint: 'np.array(list) makes the array; type() reveals the class.'
      },
      {
        title: 'Element-wise operations',
        example: "import numpy as np\n\na = np.array([2.0, 4.0])\nprint(a.mean())\n",
        exampleNotes: {"0": "an array of prices", "1": ".mean() averages ALL elements in one call — no loop written by you"},
        explain:
          "Arrays carry their own toolbox \u2014 the DOT pattern from append returns, bigger: prices.mean() RETURNS the average of every element, computed in one call inside optimised machine code, no Python loop written by you. This data-dot-method style is exactly how pandas works, so internalise it now. The array is given as setup; your job is one method call.",
        starter:
          "import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# Task: print the average of ALL elements in one call, no loop\n",
        expected: '104.475',
        hint: 'Arrays carry their own methods: mean() averages all elements.'
      },
      {
        title: 'Slicing: today and yesterday',
        example: "import numpy as np\n\nx = np.array([10, 20, 30, 40])\nprint(len(x[1:]), len(x[:-1]))\n",
        exampleNotes: {"0": "four prices: N = 4", "1": "x[1:] = from the 2nd item to the end — drops the first (today's set)", "2": "x[:-1] = everything EXCEPT the last — drops the latest (yesterday's set)", "3": "both have length N-1 = 3: four prices give three today/yesterday pairs"},
        explain:
          "Slicing takes a contiguous piece: prices[1:] runs from index 1 to the end (drops the FIRST); prices[:-1] runs up to but NOT including the last (drops the LAST) \u2014 a missing number defaults to the edge. Why exactly these two: each return needs TODAY paired with ITS yesterday, so todays exclude day one (no yesterday inside the window) and yesterdays exclude the final day. N prices yield N-1 pairs \u2014 confirm with len() on each slice.",
        starter:
          "import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# Task: build today = all except the first, and yesterday = all except the last; print both lengths in one line\n",
        expected: '3 3',
        hint: 'Four prices means three today/yesterday pairs.'
      },
      {
        title: 'Align the pairs',
        example: "import numpy as np\n\nx = np.array([10, 20, 30])\nfor t, y in zip(x[1:], x[:-1]):\n    print(t, y)\n",
        exampleNotes: {"4": "each round receives today t and ITS yesterday y"},
        explain:
          "New syntax: zip(a, b) walks two sequences SIDE BY SIDE, handing you one pair per round; for t, y in zip(today, yesterday) unpacks each pair into t and y. zip stops at the shorter sequence (equal here, by construction). The alignment logic to hold in your head: 110 with 100, 99 with 110, 108.9 with 99 \u2014 each return's numerator beside its own denominator.",
        starter:
          "import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# Task: print each (today, yesterday) pair on its own line, today first\n",
        expected: '110.0 100.0\n99.0 110.0\n108.9 99.0',
        hint: 'zip() walks two sequences side by side.'
      },
      {
        title: 'Vectorized returns',
        example: "import numpy as np\n\nx = np.array([10.0, 20.0, 30.0])\nr = x[1:] / x[:-1] - 1\nfor v in r:\n    print(round(float(v), 4))\n",
        exampleNotes: {"0": "the data", "1": "THE vectorized line: every today/yesterday pair divided at once — no loop", "2": "a loop only to PRINT cleanly", "3": "float() converts a numpy scalar to a plain number; round kills float noise"},
        explain:
          "The lesson's payoff: today / yesterday - 1 with ARRAYS divides every pair AT ONCE \u2014 one line, three divisions, zero loops; that single line IS vectorization. Display hygiene: float noise is real (0.099999\u2026 for minus ten percent), so round(float(r), 4) each value when printing \u2014 float() converts NumPy's scalar to a plain Python number that round handles cleanly. Vectorize first, round at the end.",
        starter:
          "import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# Task: compute ALL daily returns in ONE vectorized line, then print each rounded to 4 decimals\n",
        expected: '0.1\n-0.1\n0.1',
        hint: 'Rounding hides float noise (like 0.099999…) so outputs read clean.'
      },
      {
        title: 'Align the dates',
        example: "days = [\"D1\", \"D2\", \"D3\"]\nprint(*days[1:])\n",
        exampleNotes: {"0": "N=3 dates but only N-1=2 returns exist — the returns belong to days[1:] onward", "1": "the * UNPACKS the slice: print(*days[1:]) prints each element space-separated on one line — NOT as a list with brackets"},
        explain:
          "Bookkeeping that bites real code: 4 prices produce 3 returns, and the first return belongs to the SECOND date \u2014 Monday has no previous day inside the window, so returns align with dates[1:]. Getting date alignment wrong (off-by-one) silently corrupts backtests, which is why it earns its own step. New syntax: print(*list) \u2014 the star UNPACKS the list, printing each element space-separated on one line instead of showing Python's list brackets. Without the star you get ['Tue', 'Wed', 'Thu']; with it you get Tue Wed Thu.",
        starter:
          "dates = [\"Mon\", \"Tue\", \"Wed\", \"Thu\"]\n\n# Task: print the dates that own the returns, in order, in one line\n",
        expected: 'Tue Wed Thu',
        hint: 'Skip the first date — it has no yesterday inside this window.'
      },
      {
        title: 'Loop vs vector — same answer',
        example: "import numpy as np\n\nx = np.array([10, 20, 30])\nprint(round(float(x[1:].sum()), 4), round(float(x.sum() - x[0]), 4))\n",
        exampleNotes: {"0": "the data", "1": "route 1: accumulator, as in lesson 2", "2": "i = 1..2: each i is 'today', i-1 is its 'yesterday'", "3": "add each return into the total", "4": "route 2: the one-line vectorized version, then .sum()", "5": "identical numbers — two routes, one destination"},
        explain:
          "Two world-views, cross-checked. The loop route is GIVEN (lesson-2 thinking) with two new bits explained: range(1, len(prices)) generates 1, 2, \u2026 stopping before len \u2014 every today-index; and += means add to myself. Your task is the vector route: slice, divide, subtract one, and remember arrays carry .sum() to total their elements. Two different routes printing the same number is the cheapest correctness check in data work \u2014 use it constantly.",
        starter:
          "import numpy as np\n\nprices = np.array([10, 20, 30])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\n\n# Task: compute the SAME total the vectorized way, then print both totals rounded to 4, in one line\n",
        expected: '0.1 0.1',
        hint: 'Two different routes, one identical destination.'
      },
      {
        title: "Real data \u2014 a real week of daily returns",
        explain: "Five genuine closes from the last week of October 2026. One vectorized line (slice, divide, minus one) yields four actual market returns; round each to four decimals when printing. Notice what real data does that classroom numbers do not: a -2.58% day and a +1.59% day sit side by side \u2014 this granularity is where every quant dataset begins.",
        example: "import numpy as np\n\nx = np.array([423.4, 417.8, 417.8, 410.4, 393.8])  # real closes, mid Oct 2026\nr = x[1:] / x[:-1] - 1\nfor v in r:\n    print(round(float(v), 4))\n",
        exampleNotes: {"0": "the data", "1": "route 1: accumulator, as in lesson 2", "2": "i = 1..2: each i is 'today', i-1 is its 'yesterday'", "3": "add each return into the total", "4": "route 2: the one-line vectorized version, then .sum()", "5": "identical numbers — two routes, one destination"},
        starter: "import numpy as np\n\nprices = np.array([386.4, 385.2, 387.6, 377.6, 383.6])  # real closes, 26-30 Oct 2026\n\n# Task: compute all four real daily returns vectorized, then print each rounded to 4\n",
        expected: "-0.0031\n0.0062\n-0.0258\n0.0159",
        hint: "One slice line, one loop to print \u2014 real prices, same as class.",
      }
    ]
  },
  {
    n: 5,
    title: 'pandas I: Series, DataFrame & Real Data',
    steps: [
      {
        title: 'Series — labelled values',
        example: "import pandas as pd\n\ns = pd.Series([1.0, 2.0], index=[\"a\", \"b\"])\nprint(s[\"b\"])\n",
        exampleNotes: {"0": "load pandas under its nickname pd", "2": "a Series is one column whose entries carry LABELS (a, b) instead of 0, 1", "3": "square brackets accept the LABEL directly: the value stored at b"},
        explain:
          '"pandas starts here. New syntax: pd.Series(values, index=labels) creates a one-dimensional column whose entries carry LABELS instead of bare positions \u2014 index= is optional (0,1,2\u2026 by default); labels make reads self-describing. Selecting: s[\"Tue\"] fetches BY LABEL, quotes required (it is a string). Labels are why pandas rules time-series: dates become the index and alignment happens by date automatically."',
        starter:
          "import pandas as pd\n\n# Task: build a Series holding [100.0, 110.0, 99.0, 108.9] with labels Mon/Tue/Wed/Thu, then print Tuesday's value\n",
        expected: '110.0',
        hint: 'Square brackets work with labels, not just numbers.'
      },
      {
        title: 'DataFrame — a table',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"A\": [1, 2], \"B\": [3, 4]})\nprint(df.shape)\n",
        exampleNotes: {"2": "a dict of columns becomes a table: each key is a column name, each list its values", "3": "shape = (rows, columns): 2 rows, 2 columns"},
        explain:
          "The dict literal (given as setup) maps each column NAME to its list of values \u2014 curly braces, key: value pairs; it is the standard recipe for hand-built tables. New syntax: pd.DataFrame(data) wraps that dict into a real table \u2014 columns keep the key names, rows share one index. Its .shape returns (rows, columns): the first health-check on any new table (does 3\u00d73 match what was typed?).",
        starter:
          "import pandas as pd\n\ndata = {\n    \"Date\": [\"Wed\", \"Mon\", \"Thu\"],\n    \"Close\": [99.0, 100.0, 108.9],\n    \"Adj Close\": [99.0, 100.0, 108.9],\n}\n\n# Task: turn data into a DataFrame and print its shape\n",
        expected: '(3, 3)',
        hint: 'shape is (rows, columns).'
      },
      {
        title: 'Select a column',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"A\": [1, 2]})\nprint(df[\"A\"].tolist())\n",
        exampleNotes: {"2": "a minimal table", "3": "df[\"A\"] selects ONE column (a Series); .tolist() turns it into a plain Python list"},
        explain:
          "Selecting one column: df[\"Adj Close\"] returns that column as a Series \u2014 brackets plus the exact column name in quotes, capitals included. We track ADJUSTED close deliberately: splits and dividends make raw prices jump mechanically, while adjusted prices keep returns honest (a 1-for-5 split is not an 80% crash). New syntax: .tolist() converts the Series into a plain Python list \u2014 the bridge from pandas back to lessons 1\u20133.",
        starter:
          "import pandas as pd\n\ndata = {\"Date\": [\"Wed\", \"Mon\", \"Thu\"], \"Adj Close\": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# Task: print the Adj Close column as an ordinary Python list\n",
        expected: '[99.0, 100.0, 108.9]',
        hint: '.tolist() turns the Series into an ordinary Python list.'
      },
      {
        title: 'Inspect before calculating',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"A\": [1.0, 5.0, 3.0]})\nprint(len(df), df[\"A\"].max())\n",
        exampleNotes: {"2": "a small table", "3": "inspect FIRST: how many rows, and the column maximum — before trusting any math"},
        explain:
          "Professional habit #1: interrogate a table BEFORE trusting any calculation on it. The standard kit (demoed in the example): df.head() peeks at first rows, df.info() lists columns/types/gaps, df.dtypes lists types. For the task, combine two facts in one comma-separated print: len(df) counts rows; the column Series carries .max() \u2014 the same dot pattern as NumPy's mean, one toolkit everywhere.",
        starter:
          "import pandas as pd\n\ndata = {\"Date\": [\"Wed\", \"Mon\", \"Thu\"], \"Adj Close\": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# Task: print the number of rows and the highest adjusted close, in one line\n",
        expected: '3 108.9',
        hint: 'One gives the height of the table, the other the column maximum.'
      },
      {
        title: 'Sort by time',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"D\": [\"c\", \"a\", \"b\"], \"V\": [3, 1, 2]})\ndf = df.sort_values(\"D\")\nprint(df[\"V\"].tolist())\n",
        exampleNotes: {"2": "rows deliberately out of order", "3": "sort_values re-orders the ROWS by column D — plain strings sort alphabetically (a, b, c)", "4": "V now travels in the sorted order: [1, 2, 3]"},
        explain:
          "Returns only make sense in TIME order \u2014 and this table arrives deliberately shuffled. New syntax: df.sort_values(\"Date\") RETURNS a new table with rows re-ordered by the given column (it does not modify the original \u2014 you re-assign the result, as the example shows). Planted trap to notice: these dates are plain STRINGS, so they sort ALPHABETICALLY (Mon < Thu < Wed), not by calendar \u2014 real pipelines use true date types. Verify the order in your printed list.",
        starter:
          "import pandas as pd\n\ndata = {\"Date\": [\"Wed\", \"Mon\", \"Thu\"], \"Adj Close\": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# Task: sort the table by Date and print the adjusted-close column of the SORTED table as a list\n",
        expected: '[100.0, 108.9, 99.0]',
        hint: 'Alphabetical order of the three day names decides the row order — trace it by hand first.'
      },
      {
        title: 'pct_change() — built-in returns',
        example: "import pandas as pd\n\ns = pd.Series([2.0, 3.0])\nr = s.pct_change()\nprint(r.isna().tolist())\nprint(round(float(r.iloc[1]), 4))\n",
        exampleNotes: {"2": "two prices", "3": "pct_change = each value ÷ previous − 1, in decimal form", "4": "the FIRST entry is NaN — no previous value exists. NaN means unknown, NOT zero", "5": "iloc[1] = the first REAL return: 3.0/2.0 − 1 = 0.5"},
        explain:
          "pct_change() performs the whole lesson-4 slicing routine for you: each value divided by the previous one, minus one, in decimals. Critical detail: the FIRST entry has no previous value, so it becomes NaN \u2014 pandas' spelling of unknown. NaN is NOT zero: zero would claim a flat day, NaN honestly claims no information. New syntax: r.isna() tests every entry (True where NaN); r.iloc[1] selects by POSITION \u2014 the first real return.",
        starter:
          "import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\n\n# Task: compute the returns with pct_change; print the NaN pattern, then the first REAL return rounded to 4\n",
        expected: '[True, False, False, False]\n0.1',
        hint: 'isna() flags the missing first return; iloc[1] is the first real one.'
      },
      {
        title: 'Standard deviation — which formula?',
        example: "import pandas as pd\n\nr = pd.Series([0.2, -0.2, 0.2])\nprint(round(float(r.std()), 4))\n",
        exampleNotes: {"2": "a series of returns", "3": ".std() is the SAMPLE std (ddof=1, divide by N−1) by DEFAULT in pandas — NumPy's np.std defaults to ddof=0, always state which"},
        explain:
          "Volatility starts as spread: the standard deviation of daily returns. The trap that spans libraries: pandas .std() defaults to ddof=1 \u2014 the SAMPLE formula, dividing by N-1 (an honest measure from a sample); NumPy's np.std() defaults to ddof=0 \u2014 the population formula. Same data, slightly different numbers; in quant work you must KNOW which you computed (this course standardises on sample). Setup gives you a new tool: .dropna() REMOVES NaN entries \u2014 never feed NaN into a statistic.",
        starter:
          "import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\n\n# Task: print the sample standard deviation of the returns, rounded to 4\n",
        expected: '0.1155',
        hint: 'dropna() first — NaN would poison the calculation.'
      },
      {
        title: 'Mini challenge — Annualized Volatility',
        example: "import numpy as np\nimport pandas as pd\n\nr = pd.Series([0.2, -0.2, 0.2])\nprint(round(float(r.std() * np.sqrt(252)), 4))\n",
        exampleNotes: {"0": "load NumPy (for sqrt) and pandas", "3": "a series of daily returns", "4": "daily spread stretched to a year: × √252 (252 trading days). A convention, not a law"},
        explain:
          "The full pipeline assembled by you, from the Series given: pct_change() for decimal returns; dropna() to clear the unknown first entry; .std() (sample, ddof=1) for daily spread; then stretch to a year with \u00d7 \u221a252 \u2014 new syntax np.sqrt(x), NumPy's square root (252 \u2248 trading days per year). The convention assumes daily moves are roughly independent; treat the output as an ESTIMATE, not a constant of nature. Chain all four stages in one expression.",
        starter:
          "import numpy as np\nimport pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\n\n# Task: print the annualized volatility rounded to 4 \u2014 returns from pct_change, sample std, times sqrt(252)\n",
        expected: '1.833',
        hint: 'Daily spread (~0.1155) stretched by sqrt(252) ≈ 15.87.'
      },
      {
        title: "Real data \u2014 Tencent's real volatility",
        explain: "Capstone on real data: 21 genuine trading days, the whole pipeline by hand \u2014 pd.Series(closes) (a plain list converts fine), pct_change(), dropna(), sample std, \u00d7 np.sqrt(252). One number at the end: the actual annualized volatility the market priced for Tencent that October (\u224828% \u2014 high; it was a rough month). When a finance article says vol, THIS is how it was computed.",
        example: "import numpy as np\nimport pandas as pd\n\nadj = pd.Series([431.0, 421.2, 423.0, 428.2, 420.6, 411.4])  # six real closes, Sep-Oct 2026\nr = adj.pct_change().dropna()\nprint(round(float(r.std() * np.sqrt(252)), 4))\n",
        exampleNotes: {"5": "daily spread stretched to a year: × √252 (252 trading days). A convention, not a law"},
        starter: "import numpy as np\nimport pandas as pd\n\ncloses = [431.0, 421.2, 423.0, 428.2, 420.6, 411.4, 424.8, 425.8, 425.2, 423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]  # real closes 2026-09-30..10-30\n\n# Task: build the Series from closes, then print the annualized volatility of October 2026 rounded to 4\n",
        expected: "0.2808",
        hint: "Steps 6-8 chained: pct_change -> std (ddof=1) -> sqrt(252). Nothing new.",
      }
    ]
  }
];

export const getLesson = (n: number): Lesson | undefined =>
  LESSONS.find((l) => l.n === n);

export const TOTAL_LESSONS = 8; // lessons 6-8 arrive with the L3 content batch
