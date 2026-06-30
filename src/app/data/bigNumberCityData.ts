export type BigNumberPart = {
  value: number;
  word: string;
};

export type BigNumberQuestion = {
  tens: number;
  ones: number;
};

export const tensOptions: BigNumberPart[] = [
  { value: 20, word: "twenty" },
  { value: 30, word: "thirty" },
  { value: 40, word: "forty" },
  { value: 50, word: "fifty" },
  { value: 60, word: "sixty" },
  { value: 70, word: "seventy" },
  { value: 80, word: "eighty" },
  { value: 90, word: "ninety" },
];

export const onesOptions: BigNumberPart[] = [
  { value: 1, word: "one" },
  { value: 2, word: "two" },
  { value: 3, word: "three" },
  { value: 4, word: "four" },
  { value: 5, word: "five" },
  { value: 6, word: "six" },
  { value: 7, word: "seven" },
  { value: 8, word: "eight" },
  { value: 9, word: "nine" },
];

export const patternExamples: BigNumberQuestion[] = [
  { tens: 20, ones: 1 },
  { tens: 30, ones: 5 },
  { tens: 40, ones: 8 },
  { tens: 70, ones: 2 },
  { tens: 90, ones: 9 },
];

export const buildQuestions: BigNumberQuestion[] = [
  { tens: 20, ones: 1 },
  { tens: 30, ones: 5 },
  { tens: 40, ones: 8 },
  { tens: 50, ones: 2 },
  { tens: 60, ones: 7 },
  { tens: 70, ones: 4 },
  { tens: 80, ones: 6 },
  { tens: 90, ones: 9 },
];

export const findQuestions: BigNumberQuestion[] = [
  { tens: 20, ones: 3 },
  { tens: 30, ones: 8 },
  { tens: 40, ones: 6 },
  { tens: 50, ones: 9 },
  { tens: 60, ones: 4 },
  { tens: 70, ones: 6 },
  { tens: 80, ones: 1 },
  { tens: 90, ones: 7 },
  { tens: 30, ones: 2 },
  { tens: 80, ones: 9 },
];

export function getBigNumberValue(tens: number, ones: number) {
  return tens + ones;
}

export function getTensWord(tens: number) {
  return tensOptions.find((option) => option.value === tens)?.word || String(tens);
}

export function getOnesWord(ones: number) {
  return onesOptions.find((option) => option.value === ones)?.word || String(ones);
}

export function getBigNumberWord(tens: number, ones: number) {
  return `${getTensWord(tens)}-${getOnesWord(ones)}`;
}
