export type ReviewMiniGameType = "balloon" | "ferris" | "ticket" | "prizeBox";
export type ReviewPromptType = "listen" | "wordToNumber" | "findNumber";

export type ReviewQuestion = {
  id: string;
  miniGameType: ReviewMiniGameType;
  promptType: ReviewPromptType;
  targetNumber: number;
  targetWord: string;
  choices: number[];
};

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const teens: Record<number, string> = {
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
};

const tensWords: Record<number, string> = {
  20: "twenty",
  30: "thirty",
  40: "forty",
  50: "fifty",
  60: "sixty",
  70: "seventy",
  80: "eighty",
  90: "ninety",
};

export function numberToWords(value: number) {
  if (value === 100) return "one hundred";
  if (value < 10) return ones[value];
  if (value < 20) return teens[value];

  const tens = Math.floor(value / 10) * 10;
  const remainder = value % 10;
  return remainder === 0 ? tensWords[tens] : `${tensWords[tens]} ${ones[remainder]}`;
}

export function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function inRange(value: number) {
  return Math.max(1, Math.min(100, value));
}

function addChoice(choices: Set<number>, value: number, correct: number) {
  const normalized = inRange(value);
  if (normalized !== correct) choices.add(normalized);
}

export function generateAnswerChoices(correct: number) {
  const choices = new Set<number>([correct]);
  const reversed =
    correct >= 21 && correct <= 99 && correct % 10 !== 0
      ? (correct % 10) * 10 + Math.floor(correct / 10)
      : null;

  if (reversed) addChoice(choices, reversed, correct);

  if (correct === 100) {
    [90, 99, 10, 80].forEach((value) => addChoice(choices, value, correct));
  } else if (correct <= 10) {
    [correct + 1, correct + 2, correct - 1, correct + 10].forEach((value) =>
      addChoice(choices, value, correct),
    );
  } else if (correct <= 20) {
    [correct - 10, correct + 10, correct - 1, correct + 1].forEach((value) =>
      addChoice(choices, value, correct),
    );
  } else if (correct % 10 === 0) {
    [correct - 10, correct + 10, correct - 1, correct + 1].forEach((value) =>
      addChoice(choices, value, correct),
    );
  } else {
    const tens = Math.floor(correct / 10) * 10;
    const onesDigit = correct % 10;
    [tens + inRange(onesDigit + 3), correct - 10, correct + 10, correct - 1, correct + 1].forEach(
      (value) => addChoice(choices, value, correct),
    );
  }

  for (let value = 1; choices.size < 4 && value <= 100; value += 1) {
    addChoice(choices, value, correct);
  }

  return shuffleArray(Array.from(choices).slice(0, 4));
}

export function getReviewInstruction(question: ReviewQuestion) {
  if (question.miniGameType === "balloon") {
    return `Pop balloon number ${question.targetWord}.`;
  }

  if (question.miniGameType === "ferris") {
    return `Find number ${question.targetWord}.`;
  }

  if (question.miniGameType === "ticket") {
    return `Choose the matching ticket.`;
  }

  return `Open box number ${question.targetWord}.`;
}

export function generateReviewQuestions() {
  const numbers = shuffleArray([
    ...shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 2),
    ...shuffleArray([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 2),
    ...shuffleArray([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).slice(0, 2),
    ...shuffleArray([21, 23, 32, 35, 46, 58, 64, 73, 81, 89, 97, 99]).slice(0, 3),
    shuffleArray([6, 18, 21, 46, 73, 99, 100])[0],
  ]);
  const miniGames: ReviewMiniGameType[] = ["balloon", "ferris", "ticket", "prizeBox"];
  const promptTypes: ReviewPromptType[] = ["listen", "wordToNumber", "findNumber"];

  return numbers.map((targetNumber, index): ReviewQuestion => {
    const promptType = promptTypes[index % promptTypes.length];

    return {
      id: `review-${index}-${targetNumber}`,
      miniGameType: miniGames[index % miniGames.length],
      promptType,
      targetNumber,
      targetWord: numberToWords(targetNumber),
      choices: generateAnswerChoices(targetNumber),
    };
  });
}
