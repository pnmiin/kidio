const storageKey = "kidio_number_land_progress";

export type NumberLandProgress = {
  numberVillage?: {
    completed: boolean;
    bestScore: number;
    stars: number;
  };
  teenTown?: {
    unlocked: boolean;
    completed?: boolean;
    bestScore?: number;
    stars?: number;
  };
  tensMountain?: {
    unlocked: boolean;
    completed?: boolean;
    bestScore?: number;
    stars?: number;
  };
  bigNumberCity?: {
    unlocked: boolean;
    completed?: boolean;
    bestScore?: number;
    stars?: number;
  };
  reviewPark?: {
    unlocked: boolean;
    completed?: boolean;
    bestScore?: number;
    stamps?: number;
  };
};

export function getNumberLandProgress(): NumberLandProgress {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}") as NumberLandProgress;
  } catch {
    return {};
  }
}

export function getNumberVillageStars(score: number) {
  if (score === 10) return 3;
  if (score >= 8) return 2;
  if (score >= 6) return 1;
  return 0;
}

export function saveNumberVillageResult(score: number) {
  const stars = getNumberVillageStars(score);
  const progress = getNumberLandProgress();
  const bestScore = Math.max(progress.numberVillage?.bestScore || 0, score);
  const completed = score >= 8 || progress.numberVillage?.completed === true;

  const nextProgress: NumberLandProgress = {
    ...progress,
    numberVillage: {
      completed,
      bestScore,
      stars: Math.max(progress.numberVillage?.stars || 0, stars),
    },
    teenTown: {
      ...progress.teenTown,
      unlocked: completed || progress.teenTown?.unlocked === true,
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(nextProgress));
  return nextProgress;
}

export function getTeenTownStars(score: number) {
  if (score === 10) return 3;
  if (score >= 8) return 2;
  if (score >= 7) return 1;
  return 0;
}

export function saveTeenTownResult(score: number) {
  const stars = getTeenTownStars(score);
  const progress = getNumberLandProgress();
  const bestScore = Math.max(progress.teenTown?.bestScore || 0, score);
  const completed = score >= 7 || progress.teenTown?.completed === true;

  const nextProgress: NumberLandProgress = {
    ...progress,
    teenTown: {
      unlocked: true,
      completed,
      bestScore,
      stars: Math.max(progress.teenTown?.stars || 0, stars),
    },
    tensMountain: {
      unlocked: completed || progress.tensMountain?.unlocked === true,
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(nextProgress));
  return nextProgress;
}

export function getTensMountainStars(score: number) {
  if (score === 10) return 3;
  if (score >= 8) return 2;
  if (score >= 7) return 1;
  return 0;
}

export function saveTensMountainResult(score: number) {
  const stars = getTensMountainStars(score);
  const progress = getNumberLandProgress();
  const bestScore = Math.max(progress.tensMountain?.bestScore || 0, score);
  const completed = score >= 7 || progress.tensMountain?.completed === true;

  const nextProgress: NumberLandProgress = {
    ...progress,
    tensMountain: {
      unlocked: true,
      completed,
      bestScore,
      stars: Math.max(progress.tensMountain?.stars || 0, stars),
    },
    bigNumberCity: {
      unlocked: completed || progress.bigNumberCity?.unlocked === true,
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(nextProgress));
  return nextProgress;
}

export function getBigNumberCityStars(score: number) {
  if (score === 10) return 3;
  if (score >= 8) return 2;
  if (score >= 7) return 1;
  return 0;
}

export function saveBigNumberCityResult(score: number) {
  const stars = getBigNumberCityStars(score);
  const progress = getNumberLandProgress();
  const bestScore = Math.max(progress.bigNumberCity?.bestScore || 0, score);
  const completed = score >= 7 || progress.bigNumberCity?.completed === true;

  const nextProgress: NumberLandProgress = {
    ...progress,
    bigNumberCity: {
      unlocked: true,
      completed,
      bestScore,
      stars: Math.max(progress.bigNumberCity?.stars || 0, stars),
    },
    reviewPark: {
      unlocked: completed || progress.reviewPark?.unlocked === true,
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(nextProgress));
  return nextProgress;
}

export function saveReviewParkResult(score: number, stamps = 10) {
  const progress = getNumberLandProgress();
  const bestScore = Math.max(progress.reviewPark?.bestScore || 0, score);

  const nextProgress: NumberLandProgress = {
    ...progress,
    reviewPark: {
      unlocked: true,
      completed: true,
      bestScore,
      stamps: Math.max(progress.reviewPark?.stamps || 0, stamps),
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(nextProgress));
  return nextProgress;
}
