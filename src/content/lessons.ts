/**
 * M1 coding lessons — step-by-step course data (English content, per plan §4.6).
 * Each step: explanation, starter code, expected stdout (used for auto-check).
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
          'print() sends text to the console, and text must be wrapped in quotes. Press Run — the code below prints the greeting "Hello, QFS!". Then press Check: it compares your output with the expected output. (Trying changing the text between the quotes to anything you like, then run again to see the difference.)',
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
        title: 'Your first return',
        explain:
          'A return measures how much a price changed, relative to where it started. Example: if a snack used to cost 4 dollars and now costs 5, the return is the 1-dollar gain divided by the starting price — 0.25. Print the return for the two prices below, as a decimal (not a percentage).',
        starter:
          'old_price = 100.0\nnew_price = 107.5\n\n# TODO: print the return as a decimal\n',
        expected: '0.075',
        hint: 'First find the gain, then scale it by the starting price. Brackets keep the division in the right order.'
      },
      {
        title: 'Reading an error',
        explain:
          'Errors are messages, not failures. Run the code — it crashes with a NameError because the variable is misspelled. Read the last line of the error, fix the typo, and make it print 42.',
        starter: 'answer = 42\nprint(awnser)\n',
        expected: '42',
        hint: 'The error tells you the exact line. Consistent spelling fixes it.'
      }
    ]
  }
];

export const getLesson = (n: number): Lesson | undefined =>
  LESSONS.find((l) => l.n === n);

export const TOTAL_LESSONS = 8; // lessons 2-8 arrive with M1 content batch
