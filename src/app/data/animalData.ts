export type AnimalGroupId = "pets" | "farm" | "wild";

export type AnimalItem = {
  id: string;
  word: string;
  sentence: string;
  icon: string;
  image?: string;
  audioText: string;
  group: AnimalGroupId;
  homeName?: string;
  homeIcon?: string;
  homeImage?: string;
  clueItemName?: string;
  clueItemIcon?: string;
  clueItemImage?: string;
};

export type AnimalGroup = {
  id: AnimalGroupId;
  title: string;
  subtitle: string;
  gameLabel: string;
  icon: string;
  image?: string;
  route: string;
};

const animalAsset = (fileName: string) => `/assets/animals/${fileName}`;

export const animalGroups: AnimalGroup[] = [
  {
    id: "pets",
    title: "Pets",
    subtitle: "Animals we keep at home",
    gameLabel: "Game: Who Lives Here?",
    icon: "🐶",
    image: animalAsset("dog.png"),
    route: "/animal-island/pets",
  },
  {
    id: "farm",
    title: "Farm Animals",
    subtitle: "Animals from the farm",
    gameLabel: "Game: Match the Animal",
    icon: "🐮",
    image: animalAsset("cow.png"),
    route: "/animal-island/farm",
  },
  {
    id: "wild",
    title: "Wild Animals",
    subtitle: "Animals from the wild",
    gameLabel: "Game: Listen and Choose",
    icon: "🦁",
    image: animalAsset("lion.png"),
    route: "/animal-island/wild",
  },
];

export const animals: AnimalItem[] = [
  {
    id: "dog",
    word: "Dog",
    sentence: "This is a dog.",
    icon: "🐶",
    image: animalAsset("dog.png"),
    audioText: "Dog. This is a dog.",
    group: "pets",
    homeName: "Dog house",
    homeIcon: "🏠",
    homeImage: animalAsset("dog_house.png"),
    clueItemName: "Bone",
    clueItemIcon: "🦴",
    clueItemImage: animalAsset("bone.png"),
  },
  {
    id: "cat",
    word: "Cat",
    sentence: "This is a cat.",
    icon: "🐱",
    image: animalAsset("cat.png"),
    audioText: "Cat. This is a cat.",
    group: "pets",
    homeName: "Cat bed",
    homeIcon: "🛏️",
    homeImage: animalAsset("cat_house.png"),
    clueItemName: "Yarn ball",
    clueItemIcon: "🧶",
    clueItemImage: animalAsset("yarn_ball.png"),
  },
  {
    id: "rabbit",
    word: "Rabbit",
    sentence: "This is a rabbit.",
    icon: "🐰",
    image: animalAsset("rabbit.png"),
    audioText: "Rabbit. This is a rabbit.",
    group: "pets",
    homeName: "Rabbit hutch",
    homeIcon: "🏡",
    homeImage: animalAsset("rabbit_hutch.png"),
    clueItemName: "Carrot",
    clueItemIcon: "🥕",
    clueItemImage: animalAsset("carrot.png"),
  },
  {
    id: "hamster",
    word: "Hamster",
    sentence: "This is a hamster.",
    icon: "🐹",
    image: animalAsset("hamster.png"),
    audioText: "Hamster. This is a hamster.",
    group: "pets",
    homeName: "Hamster cage",
    homeIcon: "🧺",
    homeImage: animalAsset("hamster_cage.png"),
    clueItemName: "Wheel",
    clueItemIcon: "⭕",
    clueItemImage: animalAsset("wheel.png"),
  },
  {
    id: "parrot",
    word: "Parrot",
    sentence: "This is a parrot.",
    icon: "🦜",
    image: animalAsset("parrot.png"),
    audioText: "Parrot. This is a parrot.",
    group: "pets",
    homeName: "Bird cage",
    homeIcon: "🪹",
    homeImage: animalAsset("bird_cage.png"),
    clueItemName: "Feather",
    clueItemIcon: "🪶",
    clueItemImage: animalAsset("feather.png"),
  },
  {
    id: "fish",
    word: "Fish",
    sentence: "This is a fish.",
    icon: "🐟",
    image: animalAsset("fish.png"),
    audioText: "Fish. This is a fish.",
    group: "pets",
    homeName: "Fish bowl",
    homeIcon: "🐠",
    homeImage: animalAsset("fish_bowl.png"),
    clueItemName: "Bubbles",
    clueItemIcon: "🫧",
    clueItemImage: animalAsset("bubbles.png"),
  },
  {
    id: "turtle",
    word: "Turtle",
    sentence: "This is a turtle.",
    icon: "🐢",
    image: animalAsset("turtle.png"),
    audioText: "Turtle. This is a turtle.",
    group: "pets",
    homeName: "Turtle tank",
    homeIcon: "🪴",
    homeImage: animalAsset("turtle_tank.png"),
    clueItemName: "Rock",
    clueItemIcon: "🪨",
    clueItemImage: animalAsset("rock.png"),
  },
  {
    id: "cow",
    word: "Cow",
    sentence: "This is a cow.",
    icon: "🐮",
    image: animalAsset("cow.png"),
    audioText: "Cow. This is a cow.",
    group: "farm",
  },
  {
    id: "chicken",
    word: "Chicken",
    sentence: "This is a chicken.",
    icon: "🐔",
    image: animalAsset("chicken.png"),
    audioText: "Chicken. This is a chicken.",
    group: "farm",
  },
  {
    id: "duck",
    word: "Duck",
    sentence: "This is a duck.",
    icon: "🦆",
    image: animalAsset("duck.png"),
    audioText: "Duck. This is a duck.",
    group: "farm",
  },
  {
    id: "horse",
    word: "Horse",
    sentence: "This is a horse.",
    icon: "🐴",
    image: animalAsset("horse.png"),
    audioText: "Horse. This is a horse.",
    group: "farm",
  },
  {
    id: "sheep",
    word: "Sheep",
    sentence: "This is a sheep.",
    icon: "🐑",
    image: animalAsset("sheep.png"),
    audioText: "Sheep. This is a sheep.",
    group: "farm",
  },
  {
    id: "goat",
    word: "Goat",
    sentence: "This is a goat.",
    icon: "🐐",
    image: animalAsset("goat.png"),
    audioText: "Goat. This is a goat.",
    group: "farm",
  },
  {
    id: "pig",
    word: "Pig",
    sentence: "This is a pig.",
    icon: "🐷",
    image: animalAsset("pig.png"),
    audioText: "Pig. This is a pig.",
    group: "farm",
  },
  {
    id: "donkey",
    word: "Donkey",
    sentence: "This is a donkey.",
    icon: "🫏",
    image: animalAsset("donkey.png"),
    audioText: "Donkey. This is a donkey.",
    group: "farm",
  },
  {
    id: "lion",
    word: "Lion",
    sentence: "This is a lion.",
    icon: "🦁",
    image: animalAsset("lion.png"),
    audioText: "Lion. This is a lion.",
    group: "wild",
  },
  {
    id: "tiger",
    word: "Tiger",
    sentence: "This is a tiger.",
    icon: "🐯",
    image: animalAsset("tiger.png"),
    audioText: "Tiger. This is a tiger.",
    group: "wild",
  },
  {
    id: "elephant",
    word: "Elephant",
    sentence: "This is an elephant.",
    icon: "🐘",
    image: animalAsset("elephant.png"),
    audioText: "Elephant. This is an elephant.",
    group: "wild",
  },
  {
    id: "monkey",
    word: "Monkey",
    sentence: "This is a monkey.",
    icon: "🐵",
    image: animalAsset("monkey.png"),
    audioText: "Monkey. This is a monkey.",
    group: "wild",
  },
  {
    id: "giraffe",
    word: "Giraffe",
    sentence: "This is a giraffe.",
    icon: "🦒",
    image: animalAsset("giraffe.png"),
    audioText: "Giraffe. This is a giraffe.",
    group: "wild",
  },
  {
    id: "zebra",
    word: "Zebra",
    sentence: "This is a zebra.",
    icon: "🦓",
    image: animalAsset("zebra.png"),
    audioText: "Zebra. This is a zebra.",
    group: "wild",
  },
  {
    id: "bear",
    word: "Bear",
    sentence: "This is a bear.",
    icon: "🐻",
    image: animalAsset("bear.png"),
    audioText: "Bear. This is a bear.",
    group: "wild",
  },
  {
    id: "crocodile",
    word: "Crocodile",
    sentence: "This is a crocodile.",
    icon: "🐊",
    image: animalAsset("crocodile.png"),
    audioText: "Crocodile. This is a crocodile.",
    group: "wild",
  },
];

export function getAnimalsByGroup(groupId: AnimalGroupId) {
  return animals.filter((animal) => animal.group === groupId);
}

export function getAnimalGroup(groupId: string | undefined) {
  return animalGroups.find((group) => group.id === groupId);
}

export function loadAnimalProgress() {
  try {
    return JSON.parse(localStorage.getItem("kidio_animal_island_progress") || "{}") as Record<
      AnimalGroupId,
      boolean
    >;
  } catch {
    return {} as Record<AnimalGroupId, boolean>;
  }
}

export function saveAnimalGroupCompleted(groupId: AnimalGroupId) {
  const progress = loadAnimalProgress();
  localStorage.setItem(
    "kidio_animal_island_progress",
    JSON.stringify({ ...progress, [groupId]: true }),
  );
}
