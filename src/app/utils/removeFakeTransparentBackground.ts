const cleanedImageCache = new Map<string, Promise<string>>();

type ImageInput = string | HTMLImageElement;

function loadImage(source: ImageInput): Promise<HTMLImageElement> {
  if (typeof source !== "string") {
    if (source.complete && source.naturalWidth > 0) {
      return Promise.resolve(source);
    }

    return new Promise((resolve, reject) => {
      source.onload = () => resolve(source);
      source.onerror = () => reject(new Error("Unable to load image."));
    });
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${source}`));
    image.src = source;
  });
}

function isLowSaturation(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;

  return saturation < 0.13;
}

function isFakeBackgroundPixel(
  data: Uint8ClampedArray,
  offset: number,
  strict: boolean,
) {
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const a = data[offset + 3];
  const brightness = (r + g + b) / 3;
  const channelSpread = Math.max(r, g, b) - Math.min(r, g, b);

  if (a < 12) return true;
  if (!isLowSaturation(r, g, b)) return false;

  if (strict) {
    return brightness > 214 || (brightness > 164 && channelSpread < 10);
  }

  return brightness > 226 || (brightness > 178 && channelSpread < 8);
}

function softenEdges(
  data: Uint8ClampedArray,
  removed: Uint8Array,
  width: number,
  height: number,
) {
  const copy = new Uint8ClampedArray(data);
  const radius = 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = y * width + x;
      if (removed[pixelIndex]) continue;

      let nearestRemoved = Number.POSITIVE_INFINITY;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;

        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (!removed[ny * width + nx]) continue;

          const distance = Math.sqrt(dx * dx + dy * dy);
          nearestRemoved = Math.min(nearestRemoved, distance);
        }
      }

      if (nearestRemoved <= radius) {
        const offset = pixelIndex * 4;
        const r = copy[offset];
        const g = copy[offset + 1];
        const b = copy[offset + 2];
        const brightness = (r + g + b) / 3;
        const edgeStrength = (radius + 1 - nearestRemoved) / (radius + 1);

        if (brightness > 232 && isLowSaturation(r, g, b)) {
          data[offset + 3] = Math.round(data[offset + 3] * (1 - edgeStrength * 0.75));
        } else if (brightness > 204 && isLowSaturation(r, g, b)) {
          data[offset + 3] = Math.round(data[offset + 3] * (1 - edgeStrength * 0.35));
        }
      }
    }
  }
}

export async function removeFakeTransparentBackground(image: ImageInput) {
  const cacheKey = typeof image === "string" ? image : image.currentSrc || image.src;

  if (cleanedImageCache.has(cacheKey)) {
    return cleanedImageCache.get(cacheKey)!;
  }

  const promise = (async () => {
    const loadedImage = await loadImage(image);
    const width = loadedImage.naturalWidth || loadedImage.width;
    const height = loadedImage.naturalHeight || loadedImage.height;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) return cacheKey;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(loadedImage, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);
    const { data } = imageData;
    const removed = new Uint8Array(width * height);
    const queue: number[] = [];

    const enqueue = (x: number, y: number) => {
      const pixelIndex = y * width + x;
      if (removed[pixelIndex]) return;
      const offset = pixelIndex * 4;

      if (!isFakeBackgroundPixel(data, offset, true)) return;

      removed[pixelIndex] = 1;
      queue.push(pixelIndex);
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }

    for (let y = 0; y < height; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }

    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const pixelIndex = queue[cursor];
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

        const neighborIndex = ny * width + nx;
        if (removed[neighborIndex]) continue;

        const offset = neighborIndex * 4;
        if (!isFakeBackgroundPixel(data, offset, false)) continue;

        removed[neighborIndex] = 1;
        queue.push(neighborIndex);
      }
    }

    for (let pixelIndex = 0; pixelIndex < removed.length; pixelIndex += 1) {
      if (removed[pixelIndex]) {
        data[pixelIndex * 4 + 3] = 0;
      }
    }

    softenEdges(data, removed, width, height);
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/png");
  })();

  cleanedImageCache.set(cacheKey, promise);
  return promise;
}
