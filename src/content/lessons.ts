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
          'print() sends text to the console. Strings must be wrapped in quotes. Run the code below, then change it so it prints your own name instead.',
        starter: 'print("Hello, QFS!")\n',
        expected: 'Hello, QFS!',
        hint: 'Keep the quotes and the brackets — only change the text inside.'
      },
      {
        title: 'Numbers and variables',
        explain:
          'A variable is a name for a value. Prices and quantities are just numbers. Compute the position value by multiplying price by quantity, and print it.',
        starter:
          'price = 12.5      # dollars per share\nquantity = 200    # shares\n\n# TODO: print price * quantity\n',
        expected: '2500.0',
        hint: 'Replace the TODO line with: print(price * quantity)'
      },
      {
        title: 'Your first return',
        explain:
          'A return is the relative change of a price. If a stock went from 100 to 107.5, the return is (107.5 - 100) / 100 = 0.075, i.e. 7.5%. Compute and print the return of the prices below (keep it as a decimal).',
        starter:
          'old_price = 100.0\nnew_price = 107.5\n\n# TODO: print the return (new_price - old_price) / old_price\n',
        expected: '0.075',
        hint: 'print((new_price - old_price) / old_price) — brackets matter!'
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
