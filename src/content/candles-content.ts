/** Candle reader teaching content — English (content language per plan §4.6). */

export const CONCEPTS = [
  {
    key: 'body',
    title: 'Body (实体)',
    desc: 'The rectangle between the opening and closing price. Its length shows how far buyers and sellers pushed price during the session.'
  },
  {
    key: 'wick',
    title: 'Wicks / Shadows (影线)',
    desc: 'The thin lines sticking out of the body record the extreme prices of the session. A long wick means price travelled far in that direction and then came back.'
  },
  {
    key: 'volume',
    title: 'Volume (成交量)',
    desc: 'The bars at the bottom count shares traded each day. A move on high volume carries more information — more real money participated in it.'
  }
];

export const QUIZ = [
  {
    q: 'A green candle on this chart tells you that, during that session…',
    options: [
      'The opening price ended above the closing price',
      'The closing price ended above the opening price',
      'The stock paid a dividend',
      'Trading was suspended'
    ],
    answer: 1,
    explain: 'Green = close above open: buyers finished the session ahead.'
  },
  {
    q: 'A candle with a very long lower wick and a small body near the top suggests that during the session…',
    options: [
      'The price barely moved',
      'The stock never traded',
      'Sellers pushed the price far down, but buyers pulled it back before the close',
      'The volume was zero'
    ],
    answer: 2,
    explain:
      'The low sits far below where the bar closed: price fell hard intraday and then recovered.'
  },
  {
    q: 'Compared with a quiet day, a big price move on very high volume is generally…',
    options: [
      'Less meaningful, because it is random',
      'Meaningless without a news article',
      'Impossible in real markets',
      'More meaningful, because more participants acted on it'
    ],
    answer: 3,
    explain: 'High volume means conviction — many buyers and sellers agreed on the new price.'
  }
];
