export type PlacementQuestionType =
  | 'picture'
  | 'audio'
  | 'sentence'
  | 'meaning'
  | 'reading';

export type PlacementQuestion = {
  id: number;
  type: PlacementQuestionType;
  question: string;
  visual: string;
  options: string[];
  answer: string;
  audioText?: string;
};

export const placementQuestions: PlacementQuestion[] = [
  {
    id: 1,
    type: 'picture',
    question: 'What is this?',
    visual: '',
    options: ['Dog', 'Cat', 'Apple'],
    answer: 'Dog',
  },
  {
    id: 2,
    type: 'picture',
    question: 'What color is this?',
    visual: '',
    options: ['Red', 'Blue', 'Green'],
    answer: 'Red',
  },
  {
    id: 3,
    type: 'audio',
    question: 'Listen and choose.',
    audioText: 'Apple',
    visual: '',
    options: [' Apple', ' Dog', ' Car'],
    answer: ' Apple',
  },
  {
    id: 4,
    type: 'audio',
    question: 'Listen and choose.',
    audioText: 'Bird',
    visual: '',
    options: [' Cat', ' Bird', ' Banana'],
    answer: ' Bird',
  },
  {
    id: 5,
    type: 'sentence',
    question: 'I ___ apples.',
    visual: '/assets/like_apples.png',
    options: ['like', 'dog', 'blue'],
    answer: 'like',
  },
  {
    id: 6,
    type: 'sentence',
    question: 'This is my ___.',
    visual: '/assets/mommy.png',
    options: ['mother', 'sunny', 'run'],
    answer: 'mother',
  },
  {
    id: 7,
    type: 'meaning',
    question: 'How are you?',
    visual: '/assets/Happy.png',
    options: ["I'm happy.", 'It is red.', 'I have a dog.'],
    answer: "I'm happy.",
  },
  {
    id: 8,
    type: 'reading',
    question: 'Tom has a dog. What does Tom have?',
    visual: '/assets/tom_dog.png',
    options: ['A dog', 'A bike', 'An apple'],
    answer: 'A dog',
  },
];
