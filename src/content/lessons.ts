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
          "Errors are messages, not failures \u2014 professionals read them constantly. Reading order: the LAST line names the error TYPE (this example shows TypeError: cannot concatenate str and int); the lines above show WHERE (line number). New syntax: word + 1 tries to join text with a number, which Python refuses \u2014 hence the crash. Task: fix the program \u2014 it defines price but calls prcie (a spelling mistake), producing NameError. Fix the spelling so it prints 100.0.",
        starter: "price = 100.0\nprint(prcie)\n",
        expected: '100.0',
        hint: 'The error names the undefined name — make the spelling consistent everywhere.'
      },
      {
        title: 'Mini challenge — Percentage Return Calculator',
        example: "entry = 25.0\nexit_price = 31.25\nr = (exit_price - entry) / entry\nprint(r)\nprint(r * 100)\n",
        exampleNotes: {"0": "entry price (different numbers than the task)", "1": "exit price", "2": "decimal return: gain relative to entry — here 0.25", "3": "0.25 — the decimal form (25%)", "4": "25.0 — the percent form"},
        explain:
          "The whole lesson in one place: variables hold the buy and sell prices; the gain is measured relative to the entry; decimal first, percent second. This is exactly the calculation a daily P&L (profit-and-loss) report runs on every position. No new syntax \u2014 structure it yourself from the two given prices.",
        starter:
          "cost = 60.0\nprice = 90.0\n\n# Task: print the decimal return, then the percent return\n",
        expected: '0.5\n50.0',
        hint: 'Same two lines as before: relative gain first, times 100 second.'
      },
      {
        title: "Real data \u2014 a real Tencent fortnight",
        explain: "Same return logic on real prices, plus one new tool for display: round(x, 4) RETURNS a copy of x cut to 4 decimal places (x itself is untouched). Reports round for humans \u2014 0.0940 reads better than 0.09400094. Python omits trailing zeroes, so a result rounded to four places may display as 0.094 rather than 0.0940. Compute from the variables; round only at the print stage; decimal line first, percent line second.",
        example: "old = 431.0   # 2026-09-30 real close\nnew = 417.8   # 2026-10-16 real close\nr = (new - old) / old\nprint(round(r, 4))\nprint(round(r * 100, 4))\n",
        exampleNotes: {"0": "REAL close of Tencent on 2026-09-30", "1": "REAL close on 2026-10-16", "2": "the real holding-period return of that fortnight", "3": "decimal form, rounded: about -0.0306", "4": "percent form: about -3.0626"},
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
        exampleNotes: {"0": "three REAL closes from late September 2026", "1": "running peak starts at the first real price", "2": "deepest fall so far starts at zero", "3": "walk the real days in order", "4": "keep the best-so-far", "5": "track the deepest fall from that peak", "6": "the real drawdown of that stretch — about 0.0227"},
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
        example: "def square(x):\n    return x * x\nprint(square(3))\n",
        exampleNotes: {"0": "def DEFINES a function: name square, input slot x, colon opens the body", "1": "return sends the result back to whoever called", "2": "call with 3: the body runs, 9 comes back, print shows it"},
        explain:
          "A function is a named, reusable rule: define once, use forever. Two halves: the definition is GIVEN (def square(x): names it and opens the body); and CALLING square(3) in the worked example runs that body with x set to 3. New syntax: return hands a value back to the caller \u2014 the call square(3) literally BECOMES 9 wherever it sits, so you can print it, store it, or pass it onward. In your task, the same definition is given and you call it with 4.",
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
          "Now you write both halves. Anatomy of a definition: the def line (keyword def, a short lowercase name, the parameter slot in brackets, a colon), then the INDENTED body \u2014 here one return line that computes the answer. After the definition, calling the function runs that body with the given input. Nothing here is new syntax \u2014 it is pieces you have used, assembled by you for the first time.",
        starter:
          "# Task: define a function double(x) that returns twice x, then print double(21)\n",
        expected: '42',
        hint: 'Three parts: def line with colon, indented return line, call line.'
      },
      {
        title: 'return vs print',
        example: "def compute(x):\n    return x * 3 + 1\nresult = compute(4)\nprint(result)\n",
        exampleNotes: {"0": "a tiny function that RETURNS (not prints)", "1": "return hands the value back — it does not display anything", "2": "the caller CAPTURES the returned value into a variable", "3": "13 — the stored result, reusable later"},
        explain:
          "The deepest beginner confusion, settled. print() only DISPLAYS a value to a human \u2014 after showing it, the value is gone. return hands the value BACK to the caller: the call site give(9) becomes 10, and 10 can be stored, reused, combined. So y = give(9) stores the returned 10 into y, and y stays usable afterwards. A function that prints but forgets to return leaves its caller with NOTHING (Python quietly returns None) \u2014 remember this for the classifier steps.",
        starter:
          "def give(x):\n    return x + 1\n\n# Task: capture what give(9) returns into a variable y, then print y\n",
        expected: '10',
        hint: 'The caller stores what comes back — assignment captures the returned value.'
      },
      {
        title: 'Comparisons and Booleans',
        example: "print(10 > 7, 10 < 7, 10 == 10.0)\n",
        exampleNotes: {"0": "comparisons produce True/False; == COMPARES (one = assigns!); 10 == 10.0 is True — same value even with different types"},
        explain:
          "Comparisons ASK questions, and the answer is a Boolean: True or False \u2014 a value type of its own. Operators: > < >= <= compare; == TESTS equality (two signs!). One = stores, two == ask \u2014 mixing them up is the classic bug. Subtlety: 5 == 5.0 is True, because equality compares VALUE, not type (int 5 and float 5.0 hold the same number). Booleans are the fuel that powers if-statements in the next step.",
        starter:
          "# Task: print three checks in one line \u2014 whether 5 is greater than 3, whether 5 is less than 3, and whether 5 equals 5.0\n",
        expected: 'True False True',
        hint: 'The middle one asks whether the LEFT is LESS than the RIGHT — that one is False.'
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
        example: "def grade(score):\n    if score >= 50:\n        return \"credit\"\n    else:\n        return \"no credit\"\n\nprint(grade(50), grade(49.9))\n",
        exampleNotes: {"0": "a threshold function with a different cutoff", "1": ">= INCLUDES the boundary: exactly 50 gets credit", "6": "two calls on one print line: credit no credit — boundary in, just-below out"},
        explain:
          "Boundaries are where classifiers live or die: >= INCLUDES the boundary itself (exactly 10 passes), while > would exclude it. Professional discipline: write the boundary table FIRST \u2014 10 in, 9.999 out, 0 out \u2014 then code, then verify each row. Both branches RETURN a string (the function decides, the caller prints); two calls inside one print() show both verdicts on one line, space-separated.",
        starter:
          "# Task: write a function check(x) that returns \"pass\" when x is 10 or more, and \"fail\" otherwise; print check(10) and check(9.99) in one line\n",
        expected: 'pass fail',
        hint: 'Your function returns "pass" for >= 10 and "fail" below it. Check: does exactly 10 cross the line?'
      },
      {
        title: 'Mini challenge — Bull/Bear Regime Classifier',
        example: "def zone(r):\n    if r >= 0.5:\n        return \"Strong\"\n    elif r <= -0.5:\n        return \"Weak\"\n    else:\n        return \"Mid\"\nprint(zone(0.5), zone(0.3))\n",
        exampleNotes: {"0": "the example classifier uses different thresholds (0.5/-0.5) than the task", "1": "boundary included: 0.5 itself is Strong", "2": "returns \"Strong\" for the first branch", "3": "symmetric lower boundary", "4": "returns \"Weak\"", "5": "between the lines: returns \"Mid\"", "7": "Strong Mid — 0.5 crosses the line, 0.3 stays inside"},
        explain:
          "Industry convention, teaching version: a broad market INDEX moving 20% or more over two months earns the Bull/Bear label \u2014 thresholds 0.20 and -0.20, boundaries INCLUDED, input a decimal return (0.25 means 25%; do not multiply again). Caveat that matters: the convention is about broad indexes \u2014 a single stock jumping 20% is NOT a bull market. Every branch returns; nothing is printed inside.",
        starter:
          "# Task: write classify_regime(index_return): \"Bull\" for +0.20 or above, \"Bear\" for -0.20 or below, otherwise \"Neutral\"; print its verdicts on 0.25, -0.10 and 0.0 in one line\n",
        expected: 'Bull Neutral Neutral',
        hint: 'Return the string, do not print inside the function — the caller prints.'
      },
      {
        title: "Real data \u2014 classifying Tencent's real two-month moves",
        explain: "Your classifier meets real history: Tencent really did rise +48.02% in two months in spring 2024, and really did fall -17.05% across autumn 2026. The classifier definition is GIVEN below so the step still works after a refresh; your task is only to call it and print both verdicts. Even that savage real slump stays ABOVE the -0.20 line \u2014 the rule is deliberately strict, which is why the 2024 rally is the only Bull verdict you will see. One print line, two calls, two real verdicts.",
        example: "def classify_regime(index_return):\n    if index_return >= 0.20:\n        return \"Bull\"\n    elif index_return <= -0.20:\n        return \"Bear\"\n    else:\n        return \"Neutral\"\nprint(classify_regime(0.4576), classify_regime(-0.1141))   # two other REAL two-month windows (2024)\n",
        exampleNotes: {"0": "the same classifier and thresholds as the task, demonstrated before the given setup", "2": "returns Bull for the first branch", "4": "returns Bear", "6": "between the lines: returns Neutral", "7": "Bull Neutral — two other real windows, different from the task inputs"},
        starter: "def classify_regime(index_return):\n    if index_return >= 0.20:\n        return \"Bull\"\n    elif index_return <= -0.20:\n        return \"Bear\"\n    else:\n        return \"Neutral\"\n\n# Task: use the GIVEN classifier on two REAL two-month moves of Tencent:\n# +0.4802 (2024-03-05 -> 2024-05-16) and -0.1705 (2026-08-28 -> 2026-10-29)\n# print both verdicts in one line\n",
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
        example: "import numpy as np\n\nprices = np.array([2.0, 4.0, 6.0])\nprint(prices.mean())\n",
        exampleNotes: {"2": "an array of prices (different numbers than the task)", "3": ".mean() averages ALL elements in one call — no loop written by you"},
        explain:
          "Arrays carry their own toolbox \u2014 the DOT pattern from append returns, bigger: prices.mean() RETURNS the average of every element, computed in one call inside optimised machine code, no Python loop written by you. This data-dot-method style is exactly how pandas works, so internalise it now. The array is given as setup; your job is one method call.",
        starter:
          "import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# Task: print the average of ALL elements in one call, no loop\n",
        expected: '104.475',
        hint: 'Arrays carry their own methods: mean() averages all elements.'
      },
      {
        title: 'Slicing: today and yesterday',
        example: "import numpy as np\n\nx = np.array([10, 20, 30, 40])\ntoday = x[1:]\nyesterday = x[:-1]\nprint(len(today), len(yesterday))\n",
        exampleNotes: {"2": "four prices: N = 4", "3": "x[1:] drops the first (today's set)", "4": "x[:-1] drops the last (yesterday's set)", "5": "both have length N-1 = 3"},
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
        exampleNotes: {"2": "the data", "3": "THE vectorized line: every today/yesterday pair divided at once — no loop", "4": "a loop only to PRINT cleanly", "5": "float() converts a numpy scalar to a plain number; round kills float noise"},
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
        hint: 'Skip the first date — it has no yesterday inside this window. print(*dates[1:]) uses * to unpack the values.'
      },
      {
        title: 'Loop vs vector — same answer',
        example: "import numpy as np\n\nprices = np.array([20.0, 30.0, 36.0])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\nvec_total = float((prices[1:] / prices[:-1] - 1).sum())\nprint(round(loop_total, 4), round(vec_total, 4))\n",
        exampleNotes: {"2": "different prices than the task", "3": "route 1: initialise the loop accumulator (lesson-2 thinking)", "4": "i = each today-index; range stops before len(prices)", "5": "add each return into the total", "6": "route 2: the one-line vectorized version, then .sum()", "7": "identical numbers — two routes, one destination"},
        explain:
          "Two world-views, cross-checked. The loop route is GIVEN (lesson-2 thinking) with two new bits explained: range(1, len(prices)) generates 1, 2, \u2026 stopping before len \u2014 every today-index; and += means add to myself. Your task is the vector route: slice, divide, subtract one, and remember arrays carry .sum() to total their elements. Two different routes printing the same number is the cheapest correctness check in data work \u2014 use it constantly.",
        starter:
          "import numpy as np\n\nprices = np.array([10, 20, 30])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\n\n# Task: compute the SAME total the vectorized way, then print both totals rounded to 4, in one line\n",
        expected: '1.5 1.5',
        hint: 'Two different routes, one identical destination.'
      },
      {
        title: "Real data \u2014 a real week of daily returns",
        explain: "Five genuine closes from the last week of October 2026. One vectorized line (slice, divide, minus one) yields four actual market returns; round each to four decimals when printing. Notice what real data does that classroom numbers do not: a -2.58% day and a +1.59% day sit side by side \u2014 this granularity is where every quant dataset begins.",
        example: "import numpy as np\n\nx = np.array([423.4, 417.8, 417.8, 410.4, 393.8])  # real closes, mid Oct 2026\nr = x[1:] / x[:-1] - 1\nfor v in r:\n    print(round(float(v), 4))\n",
        exampleNotes: {"2": "five REAL closes from mid-October 2026 (different window than the task)", "3": "the vectorized line on real prices", "4": "loop only to print each rounded value", "5": "each real daily return, rounded"},
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
          '"pandas starts here. New syntax: pd.Series(values, index=labels) creates a one-dimensional column whose entries carry LABELS instead of bare positions \u2014 index= is optional (0,1,2\u2026 by default); labels make reads self-describing. Selecting: s[\"Tue\"] fetches BY LABEL (quotes needed \u2014 it is a string). The label system is why pandas rules time-series: dates become the index, and alignment happens by date automatically."',
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
          "Professional habit #1: interrogate a table BEFORE trusting any calculation on it. In real workflows the standard kit is df.head() (peek at first rows), df.info() (columns, types, gaps), df.dtypes (type per column). Here the example demonstrates the same principle with two quick checks available on any table: len(df) counts rows and the column Series carries .max() \u2014 same dot pattern as NumPy's mean, one toolkit everywhere.",
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
  },
  {
    n: 6,
    title: 'pandas II: Indexing, Rolling & Crossovers',
    steps: [
      {
        title: 'A real calendar index',
        example: "import pandas as pd\n\ndates = pd.to_datetime([\"2024-01-02\", \"2024-01-03\"])\nclose = pd.Series([100.0, 102.0], index=dates)\nprint(close.index.strftime(\"%Y-%m-%d\").tolist())\n",
        exampleNotes: {2: 'to_datetime converts text into real timestamps, not weekday strings', 4: 'strftime formats each index label; tolist gives a plain list'},
        explain: 'Lesson 5 deliberately exposed the problem with weekday strings. Here we fix it: pd.to_datetime(list) converts ISO date text (YYYY-MM-DD) into timestamps, and passing index=dates attaches them to the Series. Now order and slicing follow the calendar. The new display chain .index.strftime("%Y-%m-%d").tolist() turns timestamp labels back into readable date strings; it is only for printing, not for calculating. Build the dated Series first, then print all its labels.',
        starter: "import pandas as pd\n\ndates = pd.to_datetime([\"2024-01-02\", \"2024-01-03\", \"2024-01-04\", \"2024-01-05\"])\nprices = [100.0, 102.0, 101.0, 104.0]\n\n# Task: build close as a Series of prices indexed by dates, then print its date labels in YYYY-MM-DD form\n",
        expected: "['2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05']",
        hint: 'Combine pd.Series(prices, index=dates) with the same index.strftime(...).tolist() display chain as the example.'
      },
      {
        title: 'loc — select by date label',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 11.0, 12.0, 13.0], index=pd.to_datetime([\"2024-02-01\", \"2024-02-02\", \"2024-02-05\", \"2024-02-06\"]))\nprint(float(close.loc[\"2024-02-02\"]))\nprint(close.loc[\"2024-02-02\":\"2024-02-05\"].tolist())\n",
        exampleNotes: {3: 'loc[one_label] retrieves the value attached to that exact date', 4: 'a loc date slice INCLUDES both endpoints: three rows here'},
        explain: '.loc means LABEL location. close.loc["2024-01-04"] asks for a date, not position 2024 or 1. A label slice close.loc[start:end] includes BOTH the start and end dates — unlike Python and iloc slices, which exclude the stop. This makes a calendar window read naturally. The comma form .loc[rows, columns] also works on DataFrames; here a Series needs only rows. float() converts the selected pandas scalar for clean printing; .tolist() prints the whole selected window.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime([\"2024-01-02\", \"2024-01-03\", \"2024-01-04\", \"2024-01-05\", \"2024-01-08\"]))\n\n# Task: print the close on 2024-01-04, then the closes from 2024-01-03 through 2024-01-05 inclusive\n",
        expected: '101.0\n[102.0, 101.0, 104.0]',
        hint: 'Use loc twice: one exact label, then one start:end label slice. Both ends of the slice stay in the result.'
      },
      {
        title: 'iloc — select by position',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 11.0, 12.0, 13.0], index=pd.to_datetime([\"2024-02-01\", \"2024-02-02\", \"2024-02-05\", \"2024-02-06\"]))\nprint(float(close.iloc[-1]))\nprint(close.iloc[1:3].tolist())\n",
        exampleNotes: {3: 'iloc[-1] means the last POSITION regardless of its date', 4: 'positions 1 and 2 are included; position 3 is excluded'},
        explain: '.iloc means INTEGER location: zero-based positions, exactly like NumPy. close.iloc[0] is the first row and close.iloc[-1] the latest. Its slice close.iloc[1:4] includes positions 1, 2, 3 but excludes 4. Choose deliberately: loc answers “on this date”; iloc answers “at this row position”. Confusing them can silently select the wrong observation. Task: select the latest close, then positions 1 through 3 as a list.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime([\"2024-01-02\", \"2024-01-03\", \"2024-01-04\", \"2024-01-05\", \"2024-01-08\"]))\n\n# Task: print the latest close with iloc, then positions 1, 2 and 3 as a list\n",
        expected: '103.0\n[102.0, 101.0, 104.0]',
        hint: 'The latest position is -1. To include position 3, the iloc slice must stop at 4.'
      },
      {
        title: 'Boolean filtering — keep the days that qualify',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 12.0, 11.0, 14.0], index=pd.to_datetime([\"2024-02-01\", \"2024-02-02\", \"2024-02-05\", \"2024-02-06\"]))\nselected = close.loc[close > 11]\nprint(selected.index.strftime(\"%Y-%m-%d\").tolist())\nprint(selected.tolist())\n",
        exampleNotes: {3: 'close > 11 creates a True/False mask; loc keeps only True rows', 4: 'the kept dates remain attached to their values'},
        explain: 'A comparison on a whole Series produces a Boolean mask — one True/False per date. Passing that mask to .loc keeps only the True rows, preserving both date order and labels. This is declarative filtering: state the rule once, no loop required. Read close.loc[close > 103] as “close, where close is above 103”. Task: keep closes strictly above 103, print their dates, then their values. Strictly above means 103 itself does not qualify.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0, 106.0], index=pd.to_datetime([\"2024-01-02\", \"2024-01-03\", \"2024-01-04\", \"2024-01-05\", \"2024-01-08\", \"2024-01-09\"]))\n\n# Task: keep closes above 103; print the selected dates in YYYY-MM-DD form, then their values\n",
        expected: "['2024-01-05', '2024-01-09']\n[104.0, 106.0]",
        hint: 'Build selected = close.loc[close > 103], then print selected.index and selected with the example’s display methods.'
      },
      {
        title: 'rolling — a window that walks forward',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 12.0, 14.0, 16.0])\nma3 = close.rolling(3).mean()\nprint(ma3.isna().tolist())\nprint(round(float(ma3.iloc[-1]), 4))\n",
        exampleNotes: {3: 'rolling(3).mean() averages the current row and two earlier rows', 4: 'the first two windows are incomplete, so their values are NaN', 5: 'the last average is (12 + 14 + 16) / 3 = 14'},
        explain: 'rolling(n).mean() computes a moving average using the CURRENT row and the previous n-1 rows. With window 3, positions 0 and 1 are NaN because a full three-price window does not yet exist; NaN is not a sell signal and not zero. The window moves forward one row at a time and never uses future prices. Task: compute the three-day moving average, print which entries are missing, then the final moving average rounded to four decimals.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 104.0, 103.0, 106.0])\n\n# Task: compute ma3 = the 3-row rolling mean; print its NaN pattern, then its final value rounded to 4\n",
        expected: '[True, True, False, False, False]\n104.3333',
        hint: 'The final full window contains 104, 103 and 106. rolling(3).mean() computes every window for you.'
      },
      {
        title: 'Fast and slow averages become a position',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 9.0, 11.0, 12.0, 13.0])\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntarget = (fast > slow).astype(int)\nprint(target.tolist())\n",
        exampleNotes: {3: 'fast reacts to two prices; slow represents a longer three-price memory', 5: 'fast > slow gives Booleans; astype(int) maps True to 1 and False to 0', 6: '1 means target invested, 0 means target flat; early NaN comparisons are False'},
        explain: 'A fast moving average responds quickly; a slow one carries a longer memory. The teaching rule is target invested when fast > slow, otherwise flat. Comparisons produce True/False, and .astype(int) converts them to 1/0 — a target POSITION, not a trade yet. Any comparison involving an early NaN evaluates False, so warm-up rows safely start at zero. Task: build the two-row and three-row means, convert fast > slow into target, and print the complete target list.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\n# Task: create fast (2 rows), slow (3 rows), then target = 1 when fast > slow else 0; print target\n",
        expected: '[0, 0, 1, 0, 0, 0, 0, 1]',
        hint: 'Use .rolling(2).mean(), .rolling(3).mean(), then .astype(int) on the comparison.'
      },
      {
        title: 'A crossover needs yesterday AND today',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 9.0, 11.0, 12.0, 11.0])\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntoday = (fast > slow).astype(int)\nyesterday = today.shift(1)\ngolden = (today == 1) & (yesterday == 0)\ndeath = (today == 0) & (yesterday == 1)\nprint(close.index[golden].tolist())\nprint(close.index[death].tolist())\n",
        exampleNotes: {5: 'today is the current 0/1 state, not an event', 6: 'shift(1) moves each value one row later: today’s row can see the previous state', 7: 'a golden cross is the transition 0 → 1; parentheses are required around each comparison', 8: 'a death cross is 1 → 0; & combines two Boolean Series'},
        explain: 'Being above the slow average for five straight days is one regime, not five new buy signals. A crossover is a TRANSITION: golden means yesterday 0 and today 1; death means yesterday 1 and today 0. shift(1) places yesterday’s target beside today’s. New syntax: & combines two Boolean Series, and each comparison needs its own parentheses. Finally close.index[golden] keeps the dates where the event mask is True. Task: print golden-cross dates and death-cross dates in that order.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0], index=pd.to_datetime([\"2024-01-02\", \"2024-01-03\", \"2024-01-04\", \"2024-01-05\", \"2024-01-08\", \"2024-01-09\", \"2024-01-10\", \"2024-01-11\"]))\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntoday = (fast > slow).astype(int)\nyesterday = today.shift(1)\n\n# Task: create golden and death event masks, then print their dates in YYYY-MM-DD form, golden first\n",
        expected: "['2024-01-04', '2024-01-11']\n['2024-01-05']",
        hint: 'golden = (today == 1) & (yesterday == 0). Reverse the states for death, then use close.index[mask].strftime(...).tolist().'
      },
      {
        title: 'Mini challenge — MA5 / MA20 crossover signals',
        example: "import pandas as pd\n\nclose = pd.Series([10, 9, 8, 7, 8, 9, 10, 9], index=pd.date_range(\"2024-03-04\", periods=8, freq=\"B\"))\nfast = close.rolling(2).mean()\nslow = close.rolling(4).mean()\ntoday = (fast > slow).astype(int)\ngolden = (today == 1) & (today.shift(1) == 0)\nprint(close.index[golden].strftime(\"%Y-%m-%d\").tolist())\n",
        exampleNotes: {2: 'pd.date_range(..., freq="B") generates weekday trading-style labels without holidays', 3: 'the example uses shorter windows and a different price path', 6: 'only the state transition is marked, not every day above the slow mean'},
        explain: 'Now run the full event pipeline on a 30-business-day path: five-row fast average, twenty-row slow average, current target, previous target, then two transition masks. The slow MA20 needs twenty observations, so early rows cannot generate a valid signal. The dataset is synthetic and intentionally small enough to audit by hand; a real report would also document data source, execution timing and costs. Print golden dates first, death dates second. Do not print the expected dates directly — derive them from the prices.',
        starter: "import pandas as pd\n\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90], index=pd.date_range(\"2024-01-02\", periods=30, freq=\"B\"))\n\n# Task: compute MA5 and MA20, then print golden-cross dates and death-cross dates in YYYY-MM-DD form\n",
        expected: "['2024-02-02']\n['2024-02-09']",
        hint: 'Reuse the previous step exactly, changing only the rolling windows to 5 and 20. Each mask compares today with today.shift(1).'
      }
    ]
  },
  {
    n: 7,
    title: 'pandas III: Groupby, Merge & Visual Summaries',
    steps: [
      {
        title: 'From timestamps to month labels',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"Date\": pd.to_datetime([\"2024-01-31\", \"2024-02-01\"]), \"Return\": [0.02, -0.01]})\ndf[\"Month\"] = df[\"Date\"].dt.to_period(\"M\").astype(str)\nprint(df[\"Month\"].tolist())\n",
        exampleNotes: {3: '.dt opens datetime tools; to_period("M") assigns each timestamp to its calendar month', 4: 'astype(str) makes labels readable, ready for grouping'},
        explain: 'Monthly analysis starts by giving every daily row a month key. For a true datetime column, .dt.to_period("M") converts each timestamp to its calendar month; .astype(str) displays it as YYYY-MM. Assigning df["Month"] = ... adds a column without changing the original dates. This is preferable to slicing text by character position because pandas understands real dates. Task: add Month to the supplied three-row table and print its values in row order.',
        starter: "import pandas as pd\n\ndf = pd.DataFrame({\"Date\": pd.to_datetime([\"2024-01-30\", \"2024-01-31\", \"2024-02-01\"]), \"Return\": [0.01, 0.03, -0.02]})\n\n# Task: add a Month column in YYYY-MM form, then print the Month column as a list\n",
        expected: "['2024-01', '2024-01', '2024-02']",
        hint: 'Copy the full .dt.to_period("M").astype(str) chain from the example and assign it to df["Month"].'
      },
      {
        title: 'groupby — split, apply, combine',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"Jan\", \"Jan\", \"Feb\"], \"Return\": [0.01, 0.03, -0.02]})\nmonthly_mean = df.groupby(\"Month\")[\"Return\"].mean()\nprint(monthly_mean.round(4).tolist())\n",
        exampleNotes: {3: 'split rows by Month, select Return, apply mean to each group, then combine the results', 4: 'Series.round(4) rounds every result for display; groups appear in sorted key order'},
        explain: 'groupby follows three ideas: SPLIT rows by a key, APPLY a calculation inside each group, COMBINE the answers. df.groupby("Month")["Return"].mean() therefore produces one average per month, not one average over the whole table. The brackets select Return before the calculation. Groups are sorted by their Month key here, and Series.round(4) rounds every value for display. Task: compute each month’s mean daily return and print the rounded results as a list.',
        starter: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-01\", \"2024-01\", \"2024-02\", \"2024-02\", \"2024-02\"], \"Return\": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# Task: compute mean Return by Month and print the results rounded to 4 as a list\n",
        expected: '[0.0067, 0.0167]',
        hint: 'Chain groupby("Month"), ["Return"], .mean(), then round and tolist.'
      },
      {
        title: 'One summary, several statistics',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"Jan\", \"Jan\", \"Feb\", \"Feb\"], \"Return\": [0.01, 0.03, 0.02, 0.04]})\nsummary = df.groupby(\"Month\").agg(Days=(\"Return\", \"count\"), Mean=(\"Return\", \"mean\"), Vol=(\"Return\", \"std\"))\nfor row in summary.itertuples():\n    print(row.Index, row.Days, round(row.Mean, 4), round(row.Vol, 4))\n",
        exampleNotes: {3: 'named aggregation: output name = (input column, calculation); std is sample std', 4: 'itertuples visits one result row at a time; Index is the group key', 5: 'row.Mean reads a named result column; each month prints one readable line'},
        explain: 'A report often needs count, mean and volatility together. Named aggregation uses OutputName=("Return", "statistic") inside .agg(...): Days counts observations, Mean averages them, Vol computes the SAMPLE standard deviation (pandas ddof=1). The group key becomes the index. New display syntax: summary.itertuples() yields one row at a time; row.Index, row.Days and row.Mean read its fields. Task: build Days, Mean and Vol by Month, then print Month, Days, Mean and Vol with both numeric statistics rounded to four decimals.',
        starter: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-01\", \"2024-01\", \"2024-02\", \"2024-02\", \"2024-02\"], \"Return\": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# Task: aggregate Days=count, Mean=mean and Vol=sample std of Return by Month\n# Print one line per month: Month Days Mean Vol, rounding Mean and Vol to 4\n",
        expected: '2024-01 3 0.0067 0.0252\n2024-02 3 0.0167 0.0208',
        hint: 'Use the three named aggregations exactly as in the example, then itertuples() and row.Index for Month.'
      },
      {
        title: 'Monthly return compounds; it does not add',
        example: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"Jan\", \"Jan\", \"Feb\", \"Feb\"], \"Return\": [0.10, 0.20, -0.05, 0.10]})\ndf[\"Growth\"] = 1 + df[\"Return\"]\nmonthly = df.groupby(\"Month\")[\"Growth\"].prod() - 1\nprint(monthly.round(4).tolist())\n",
        exampleNotes: {3: 'a return r turns $1 into 1+r dollars; this is the growth factor', 4: 'prod multiplies factors within each month; subtract 1 to return to decimal return', 5: 'January is 1.1 × 1.2 − 1 = 0.32, not 0.30'},
        explain: 'Daily returns compound: after returns a and b, $1 becomes (1+a)(1+b), so adding them ignores the base changing each day. We create Growth = 1 + Return, use .prod() inside each month to multiply its growth factors, then subtract 1. This preserves order-independent multiplication while the underlying daily rows must still represent valid consecutive returns. Task: compute the compounded monthly returns and print them rounded to four decimals as a list.',
        starter: "import pandas as pd\n\ndf = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-01\", \"2024-01\", \"2024-02\", \"2024-02\", \"2024-02\"], \"Return\": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# Task: compound daily returns within each Month using growth factors, then print monthly returns rounded to 4\n",
        expected: '[0.0195, 0.0504]',
        hint: 'Create Growth = 1 + Return, group by Month, call prod(), subtract 1, then round.'
      },
      {
        title: 'merge — align two tables by a key',
        example: "import pandas as pd\n\nstock = pd.DataFrame({\"Month\": [\"Jan\", \"Feb\"], \"Stock\": [0.02, 0.05]})\nmarket = pd.DataFrame({\"Month\": [\"Jan\", \"Feb\"], \"Market\": [0.01, 0.03]})\nmerged = stock.merge(market, on=\"Month\", how=\"left\", validate=\"one_to_one\")\nprint(merged.shape)\nprint(merged[\"Market\"].tolist())\n",
        exampleNotes: {4: 'on="Month" matches equal keys; left keeps every stock row; validate checks unique keys on both sides', 5: 'shape confirms the join did not unexpectedly duplicate or drop rows'},
        explain: 'merge aligns rows by a shared KEY instead of hoping two tables happen to be in the same order. on="Month" specifies the key; how="left" preserves every left (stock) row and attaches matching market data; validate="one_to_one" raises an error if either key column contains duplicates. Always check .shape afterwards: duplicate keys can multiply rows, while an inner join can silently drop them. Task: left-merge the tables, print the resulting shape, then print which Market entries are missing.',
        starter: "import pandas as pd\n\nstock = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-02\", \"2024-03\"], \"Stock\": [0.02, 0.05, -0.01]})\nmarket = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-03\"], \"Market\": [0.01, 0.02]})\n\n# Task: left-merge market onto stock on Month with one_to_one validation; print shape, then Market's NaN pattern\n",
        expected: '(3, 3)\n[False, True, False]',
        hint: 'February has no market row, so the preserved stock row receives NaN. Use merged["Market"].isna().tolist().'
      },
      {
        title: 'Active return — strategy minus benchmark',
        example: "import pandas as pd\n\nmerged = pd.DataFrame({\"Month\": [\"Jan\", \"Feb\"], \"Stock\": [0.02, 0.05], \"Market\": [0.01, 0.03]})\nmerged[\"Active\"] = merged[\"Stock\"] - merged[\"Market\"]\nprint(merged[\"Active\"].round(4).tolist())\nprint(round(float(merged[\"Active\"].mean()), 4))\n",
        exampleNotes: {3: 'subtract matching columns row by row: active return is relative to the benchmark', 5: 'the mean uses available observations; always inspect missing values separately'},
        explain: 'Active return measures performance relative to a benchmark: Active = Stock − Market for the SAME month. A positive stock return can still be negative active return if the market rose more. After merging, aligned columns make this one vectorized subtraction. pandas .mean() skips NaN by default, which is useful but not permission to ignore missing data — the previous step’s mask is part of the report. Task: create Active, print its missing-value pattern, then its mean over available months rounded to four decimals.',
        starter: "import pandas as pd\n\nmerged = pd.DataFrame({\"Month\": [\"2024-01\", \"2024-02\", \"2024-03\"], \"Stock\": [0.02, 0.05, -0.01], \"Market\": [0.01, float(\"nan\"), 0.02]})\n\n# Task: create Active = Stock - Market; print its NaN pattern, then its available mean rounded to 4\n",
        expected: '[False, True, False]\n-0.01',
        hint: 'January active is +0.01 and March is −0.03. Their available mean is −0.01; February stays unknown.'
      },
      {
        title: 'A visual summary without hidden dependencies',
        example: "import pandas as pd\n\nsummary = pd.DataFrame({\"Month\": [\"Jan\", \"Feb\"], \"Return\": [0.02, -0.01]})\nfor row in summary.itertuples(index=False):\n    blocks = \"█\" * int(round(abs(row.Return) * 100))\n    direction = \"+\" if row.Return >= 0 else \"-\"\n    print(row.Month, direction, blocks)\n",
        exampleNotes: {3: 'itertuples(index=False) supplies only the named data columns', 4: 'one block represents one percentage point; abs uses magnitude for bar length', 5: 'the sign carries direction; repeating a string draws a text bar', 6: 'a dependency-free chart students can run in this browser runtime'},
        explain: 'A chart should answer a question, not merely decorate. Here each █ represents one percentage point, +/− shows direction, and bar length makes month comparison immediate. New syntax: abs(x) is magnitude, "█" * n repeats the block n times, int() makes the count whole, and index=False removes the extra row-number field. This text plot is deliberate: the browser course does not pretend matplotlib is installed. The same labels and scales would feed df.plot() in a configured desktop environment. Task: draw the three supplied monthly returns at one block per percentage point.',
        starter: "import pandas as pd\n\nsummary = pd.DataFrame({\"Month\": [\"Jan\", \"Feb\", \"Mar\"], \"Return\": [0.03, -0.02, 0.01]})\n\n# Task: print Month, direction (+/-), and one █ per percentage point for each row\n",
        expected: 'Jan + ███\nFeb - ██\nMar + █',
        hint: 'Reuse the example loop. abs(Return) × 100 gives the number of percentage-point blocks.'
      },
      {
        title: 'Mini challenge — Monthly market-return report',
        example: "import pandas as pd\n\nprices = pd.DataFrame({\"Date\": pd.to_datetime([\"2024-01-31\", \"2024-02-01\", \"2024-02-02\"]), \"Stock\": [100.0, 102.0, 103.0]})\nprices[\"StockReturn\"] = prices[\"Stock\"].pct_change()\ndaily = prices.dropna().copy()\ndaily[\"Month\"] = daily[\"Date\"].dt.to_period(\"M\").astype(str)\ndaily[\"Growth\"] = 1 + daily[\"StockReturn\"]\nmonthly = daily.groupby(\"Month\")[\"Growth\"].prod() - 1\nprint(monthly.round(4).tolist())\n",
        exampleNotes: {4: 'pct_change creates daily returns; the first unknown row must not become zero', 5: 'dropna removes that unknown row; copy makes an independent table', 7: 'the growth-factor column and prod() are exactly the method used in the task'},
        explain: 'Assemble the complete report. Merge is already done in this supplied daily table. Compute StockReturn and MarketReturn with pct_change, drop the first unknown row, then add Month. For each return column create a growth factor, group by Month, multiply with prod(), subtract 1, and combine the two monthly Series with pd.concat([stock_monthly, market_monthly], axis=1). New syntax: axis=1 places them side by side as columns; .columns=["Stock", "Market"] names them. Finally Active = Stock − Market. Print Month, Stock, Market and Active, all numeric values rounded to four decimals.',
        starter: "import pandas as pd\n\nprices = pd.DataFrame({\"Date\": pd.to_datetime([\"2024-01-30\", \"2024-01-31\", \"2024-02-01\", \"2024-02-02\", \"2024-02-05\", \"2024-02-06\"]), \"Stock\": [100.0, 102.0, 101.0, 100.0, 101.0, 103.0], \"Market\": [200.0, 202.0, 201.0, 200.0, 202.0, 204.0]})\n\n# Task: build monthly compounded Stock and Market returns from daily prices, then Active = Stock - Market\n# Print Month Stock Market Active, one row per month, numeric values rounded to 4\n",
        expected: '2024-01 0.02 0.01 0.01\n2024-02 0.0098 0.0099 -0.0001',
        hint: 'Compute both pct_change columns before dropna. Group GrowthStock and GrowthMarket separately, concatenate with axis=1, rename the two columns, then add Active.'
      }
    ]
  },
  {
    n: 8,
    title: 'Capstone: Transparent pandas Backtesting',
    steps: [
      {
        title: 'Signals are targets; execution comes next bar',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 9.0, 11.0, 12.0, 11.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\nprint(target.tolist())\nprint(held.tolist())\n",
        exampleNotes: {3: 'target uses information available at the current close', 4: 'shift(1) delays exposure by one bar; fillna(0) starts with no position', 5: 'target is what we want; held is what earns the next bar'},
        explain: 'The central anti-look-ahead rule: a signal computed from today’s close cannot earn today’s close-to-close return. We use a close-to-next-close teaching model: target is calculated at bar t, then target.shift(1) becomes held at bar t+1. fillna(0) makes the unknown first held position explicitly zero; astype(int) restores a clean 0/1 list. This models next-bar execution, not a promise about a particular order type. Task: compute target from MA2 > MA3, delay it one bar, and print target then held.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\n# Task: target = 1 when MA2 > MA3; held = target delayed by one bar with initial 0; print both lists\n",
        expected: '[0, 0, 1, 0, 0, 0, 0, 1]\n[0, 0, 0, 1, 0, 0, 0, 0]',
        hint: 'held = target.shift(1).fillna(0).astype(int). Notice that target’s first 1 reaches held on the following row.'
      },
      {
        title: 'Position × market return = gross strategy return',
        example: "import pandas as pd\n\nclose = pd.Series([10.0, 9.0, 11.0, 12.0, 11.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\nasset_return = close.pct_change().fillna(0)\ngross_return = held * asset_return\nprint(round(float(gross_return.sum()), 4))\n",
        exampleNotes: {5: 'the first market return is unknown; for this report’s flat initial position we explicitly set it to zero', 6: 'held=1 earns the bar return; held=0 earns zero before costs'},
        explain: 'Once timing is aligned, the gross daily strategy return is simply held × asset_return. A flat position earns zero before costs; an invested position earns that bar’s market return. We fill the first asset return with zero only because the initial held position is also zero and there is no prior trade inside this report — do not silently turn unknown returns into zero in general. Task: use the held positions from step 1, compute market and gross returns, print held, then the SUM of gross returns rounded to four decimals. The sum is a diagnostic, not yet compounded performance.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\n\n# Task: delay target into held; compute asset_return and gross_return\n# Print held, then the sum of gross_return rounded to 4\n",
        expected: '[0, 0, 0, 1, 0, 0, 0, 0]\n0.0198',
        hint: 'Only the row where held=1 contributes: 103 / 101 − 1 ≈ 0.0198.'
      },
      {
        title: 'Turnover counts actual changes',
        example: "import pandas as pd\n\nheld = pd.Series([0.0, 1.0, 1.0, 0.0, 1.0])\nturnover = held.diff().abs().fillna(held.abs())\ntrades = int(turnover.sum())\nprint(turnover.tolist())\nprint(trades)\n",
        exampleNotes: {2: 'diff compares each held position with the previous bar; abs counts entries and exits symmetrically', 3: 'the first diff is unknown, so use the absolute initial position instead', 4: '0→1 and 1→0 each count as one teaching-model trade event'},
        explain: 'Staying invested is not a new trade. Turnover measures CHANGE in position: held.diff().abs() gives 1 for 0→1 or 1→0 and 0 for no change. The first diff has no previous value, so fillna(held.abs()) counts an initially invested position as an entry. int(turnover.sum()) counts position-change events in this simplified long/flat model. Task: derive turnover and trades from the given held path, print the turnover list, then the trade-event count.',
        starter: "import pandas as pd\n\nheld = pd.Series([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])\n\n# Task: compute absolute position changes as turnover, using abs(initial held) for the first row\n# Print turnover, then int(turnover.sum())\n",
        expected: '[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]\n2',
        hint: 'There is one entry and one exit. diff().abs() finds both; the initial position is zero.'
      },
      {
        title: 'Costs turn gross into net',
        example: "import pandas as pd\n\ngross_return = pd.Series([0.0, 0.02, 0.01])\nturnover = pd.Series([0.0, 1.0, 1.0])\ncost_rate = 0.001\nnet_return = gross_return - turnover * cost_rate\nprint(round(float((turnover * cost_rate).sum()), 4))\nprint(round(float(net_return.sum()), 4))\n",
        exampleNotes: {4: 'each 0/1 position change pays 0.1% in this simplified proportional-cost model', 5: 'cost is subtracted only when turnover occurs; gross and net are different reports'},
        explain: 'A backtest that ignores trading costs flatters active strategies. This teaching model charges cost_rate × turnover on each position change and subtracts it from that bar’s gross return. Real execution can also include spread, slippage, taxes and market impact; our single rate is an assumption to disclose, not universal truth. Task: compute net_return using a 0.001 cost rate, print total costs, then the sum of net returns, both rounded to four decimals.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\ncost_rate = 0.001\n\n# Task: compute net_return after proportional costs; print total costs, then net_return.sum(), rounded to 4\n",
        expected: '0.002\n0.0178',
        hint: 'Two position changes × 0.001 gives total cost 0.002. Subtract turnover × cost_rate from gross_return.'
      },
      {
        title: 'Equity curve and total return',
        example: "import pandas as pd\n\nnet_return = pd.Series([0.10, -0.05, 0.02])\nequity = 10000 * (1 + net_return).cumprod()\nprint(round(float(equity.iloc[-1]), 2))\nprint(round(float(equity.iloc[-1] / 10000 - 1), 4))\n",
        exampleNotes: {2: 'cumprod compounds every daily growth factor in time order', 3: 'equity starts from an initial capital of 10000 and evolves after each net return', 4: 'ending equity divided by initial capital, minus 1, is total return'},
        explain: 'Net daily returns must compound into an equity curve. cumprod() multiplies every 1 + net_return in order, and multiplying by initial capital 10000 gives account value after each bar. Total return is ending equity / initial equity − 1, not the simple sum of daily returns. Task: build the equity curve from the net returns assembled in the previous step, print ending equity to two decimals, then total return to four decimals.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\n\n# Task: starting with 10000, compound net returns into equity; print final equity (2 decimals), then total return (4)\n",
        expected: '10177.83\n0.0178',
        hint: 'equity = 10000 * (1 + net_return).cumprod(). Read the final value with equity.iloc[-1].'
      },
      {
        title: 'Maximum drawdown from the equity curve',
        example: "import pandas as pd\n\nequity = pd.Series([10000.0, 11000.0, 10450.0, 10659.0])\npeak = equity.cummax()\ndrawdown = 1 - equity / peak\nprint(round(float(drawdown.max()), 4))\n",
        exampleNotes: {2: 'cummax is the highest equity seen SO FAR at every bar', 3: 'drawdown compares each equity value with its own earlier peak', 4: 'the deepest observed decline is the maximum drawdown'},
        explain: 'Maximum drawdown belongs on the EQUITY curve, including costs — not on raw prices unless that is explicitly the benchmark being measured. cummax() tracks the running peak; 1 − equity / peak measures each decline; .max() finds the deepest. This is backward-looking path risk, not a maximum possible future loss. Task: reuse the net-return pipeline, build equity, and print maximum drawdown rounded to four decimals.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\nequity = 10000 * (1 + net_return).cumprod()\n\n# Task: compute running peak and drawdown; print maximum drawdown rounded to 4\n",
        expected: '0.001',
        hint: 'peak = equity.cummax(); drawdown = 1 - equity / peak. The exit cost creates the only decline here.'
      },
      {
        title: 'A reusable backtest report',
        example: "import pandas as pd\n\ndef report(close, fast_n, slow_n, cost_rate):\n    target = (close.rolling(fast_n).mean() > close.rolling(slow_n).mean()).astype(int)\n    held = target.shift(1).fillna(0).astype(int)\n    turnover = held.diff().abs().fillna(held.abs())\n    net = held * close.pct_change().fillna(0) - turnover * cost_rate\n    equity = 10000 * (1 + net).cumprod()\n    drawdown = 1 - equity / equity.cummax()\n    return float(equity.iloc[-1] / 10000 - 1), float(drawdown.max()), int(turnover.sum())\n\nr, dd, trades = report(pd.Series([10.0, 9.0, 11.0, 12.0, 11.0]), 2, 3, 0.001)\nprint(round(r, 4), round(dd, 4), trades)\n",
        exampleNotes: {3: 'one function packages the timing, return, cost, equity and risk assumptions', 11: 'return three values; tuple unpacking gives them separate names', 12: 'print total return, maximum drawdown and trade events in a fixed order'},
        explain: 'Now package the whole pipeline so parameters can change without rewriting logic. report returns total return, maximum drawdown and trade events. This transparent pandas engine mirrors the separation used by backtesting.py: indicators are prepared in init(), while next() advances bar by bar. We intentionally do NOT import backtesting.py here because this browser runtime has not loaded it; the pandas calculations are the executable reference. Task: complete the same report function and call it with MA2/MA3 and 0.001 cost on the supplied close series.',
        starter: "import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\ndef report(close, fast_n, slow_n, cost_rate):\n    # Task: return total_return, max_drawdown, trade_events using the pipeline above\n    pass\n\nr, dd, trades = report(close, 2, 3, 0.001)\nprint(round(r, 4), round(dd, 4), trades)\n",
        expected: '0.0178 0.001 2',
        hint: 'Inside the function: target, held, turnover, net, equity, drawdown. Return the three computed results in that order.'
      },
      {
        title: 'Final challenge — compare, then question the result',
        example: "import pandas as pd\n\n# Always compare with a benchmark on the SAME price window.\nclose = pd.Series([100.0, 110.0, 99.0, 108.9])\nbuy_hold_return = close.iloc[-1] / close.iloc[0] - 1\nbuy_hold_equity = 10000 * close / close.iloc[0]\nbuy_hold_dd = 1 - buy_hold_equity / buy_hold_equity.cummax()\nprint(\"BuyHold\", round(float(buy_hold_return), 4), round(float(buy_hold_dd.max()), 4))\n",
        exampleNotes: {3: 'the example benchmark uses a different price path', 4: 'buy-and-hold starts at the first close and ends at the last', 5: 'its equity follows the same normalized price path', 7: 'a strategy report is more informative beside this simple alternative'},
        explain: 'Final L3 gate: run report on three parameter pairs — (3,10), (5,20), (8,20) — with cost 0.001. Print one line per pair as fast/slow total_return max_drawdown trade_events, then BuyHold total_return max_drawdown. The benchmark is given conceptually in the example. For the parameter label, new display syntax f"{fast_n}/{slow_n}" inserts the two variables into text such as 3/10. Compare 3/10 with the others, but do NOT crown it a future winner: choosing the best parameters on this same 30-day path is in-sample selection and can overfit. A serious next step would validate on later unseen data. All prices here are synthetic; the purpose is an auditable report, not a return promise.',
        starter: "import pandas as pd\n\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90])\n\ndef report(close, fast_n, slow_n, cost_rate):\n    target = (close.rolling(fast_n).mean() > close.rolling(slow_n).mean()).astype(int)\n    held = target.shift(1).fillna(0).astype(int)\n    turnover = held.diff().abs().fillna(held.abs())\n    net = held * close.pct_change().fillna(0) - turnover * cost_rate\n    equity = 10000 * (1 + net).cumprod()\n    drawdown = 1 - equity / equity.cummax()\n    return float(equity.iloc[-1] / 10000 - 1), float(drawdown.max()), int(turnover.sum())\n\n# Task: print report(close, fast, slow, 0.001) for (3,10), (5,20), (8,20), one line each as fast/slow r dd trades\n# Then print BuyHold total return and max drawdown on the same path, all numeric results rounded to 4\n",
        expected: '3/10 -0.0223 0.0778 2\n5/20 -0.0999 0.0999 2\n8/20 -0.1009 0.1009 1\nBuyHold -0.25 0.25',
        hint: 'Loop through configurations = [(3, 10), (5, 20), (8, 20)]. BuyHold return is last/first − 1; its equity is 10000 × close/first close.'
      }
    ]
  }
];

export const getLesson = (n: number): Lesson | undefined =>
  LESSONS.find((l) => l.n === n);

export const TOTAL_LESSONS = 8;
