export type NumberVillageQuestionType =
  | "listen-choose"
  | "count-objects"
  | "next-number";

export type NumberVillageQuestion = {
  id: string;
  type: NumberVillageQuestionType;
  prompt: string;
  spokenText: string;
  correctAnswer: number;
  options: number[];
  visualObjects?: {
    emoji: string;
    label: string;
    count: number;
  };
  sequence?: number[];
};

export const numberWords: Record<number, string> = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
};

export const numberVillageQuestions: NumberVillageQuestion[] = [
  {
    id: "listen-five",
    type: "listen-choose",
    prompt: "Listen and choose the number.",
    spokenText: "five",
    correctAnswer: 5,
    options: [2, 5, 7, 9],
  },
  {
    id: "listen-two",
    type: "listen-choose",
    prompt: "Listen and choose the number.",
    spokenText: "two",
    correctAnswer: 2,
    options: [1, 2, 4, 6],
  },
  {
    id: "listen-eight",
    type: "listen-choose",
    prompt: "Listen and choose the number.",
    spokenText: "eight",
    correctAnswer: 8,
    options: [3, 6, 8, 10],
  },
  {
    id: "listen-ten",
    type: "listen-choose",
    prompt: "Listen and choose the number.",
    spokenText: "ten",
    correctAnswer: 10,
    options: [4, 7, 9, 10],
  },
  {
    id: "count-stars",
    type: "count-objects",
    prompt: "How many stars?",
    spokenText: "How many stars?",
    correctAnswer: 4,
    options: [3, 4, 5],
    visualObjects: { emoji: "⭐", label: "stars", count: 4 },
  },
  {
    id: "count-apples",
    type: "count-objects",
    prompt: "How many apples?",
    spokenText: "How many apples?",
    correctAnswer: 6,
    options: [5, 6, 8],
    visualObjects: { emoji: "🍎", label: "apples", count: 6 },
  },
  {
    id: "count-balloons",
    type: "count-objects",
    prompt: "How many balloons?",
    spokenText: "How many balloons?",
    correctAnswer: 7,
    options: [6, 7, 9],
    visualObjects: { emoji: "🎈", label: "balloons", count: 7 },
  },
  {
    id: "count-blocks",
    type: "count-objects",
    prompt: "How many blocks?",
    spokenText: "How many blocks?",
    correctAnswer: 9,
    options: [7, 8, 9],
    visualObjects: { emoji: "🧱", label: "blocks", count: 9 },
  },
  {
    id: "next-four",
    type: "next-number",
    prompt: "What number comes next?",
    spokenText: "What number comes next after three?",
    correctAnswer: 4,
    options: [4, 5, 6],
    sequence: [1, 2, 3],
  },
  {
    id: "next-eight",
    type: "next-number",
    prompt: "What number comes next?",
    spokenText: "What number comes next after seven?",
    correctAnswer: 8,
    options: [6, 8, 10],
    sequence: [5, 6, 7],
  },
];
