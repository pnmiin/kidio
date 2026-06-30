export type TensNumber = {
  value: number;
  word: string;
};

export const tensNumbers: TensNumber[] = [
  { value: 10, word: "ten" },
  { value: 20, word: "twenty" },
  { value: 30, word: "thirty" },
  { value: 40, word: "forty" },
  { value: 50, word: "fifty" },
  { value: 60, word: "sixty" },
  { value: 70, word: "seventy" },
  { value: 80, word: "eighty" },
  { value: 90, word: "ninety" },
  { value: 100, word: "one hundred" },
];

export function getTensWord(value: number) {
  return tensNumbers.find((number) => number.value === value)?.word || String(value);
}
