export type TeenNumber = {
  value: number;
  word: string;
};

export const teenTownNumbers: TeenNumber[] = [
  { value: 11, word: "eleven" },
  { value: 12, word: "twelve" },
  { value: 13, word: "thirteen" },
  { value: 14, word: "fourteen" },
  { value: 15, word: "fifteen" },
  { value: 16, word: "sixteen" },
  { value: 17, word: "seventeen" },
  { value: 18, word: "eighteen" },
  { value: 19, word: "nineteen" },
  { value: 20, word: "twenty" },
];

export function getTeenWord(value: number) {
  return teenTownNumbers.find((number) => number.value === value)?.word || String(value);
}
