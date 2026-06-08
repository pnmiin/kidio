import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fg from "fast-glob";

const projectRoot = process.cwd();
const assetsDir = path.join(projectRoot, "public", "assets");
const outputDir = path.join(assetsDir, "transparent");
const modelDir = path.join(
  projectRoot,
  "node_modules",
  "@imgly",
  "background-removal-node",
  "dist",
);
const publicPath = `${pathToFileURL(modelDir).href}/`;

const imageGlobs = ["*.png", "*.jpg", "*.jpeg", "*.webp"];
const scriptPath = fileURLToPath(import.meta.url);
const mimeByExtension = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const config = {
  publicPath,
  model: "medium",
  output: {
    format: "image/png",
    quality: 1,
    type: "foreground",
  },
};

await mkdir(outputDir, { recursive: true });

async function processOne(relativePath) {
  const inputPath = path.join(assetsDir, relativePath);
  const parsed = path.parse(relativePath);
  const outputPath = path.join(outputDir, `${parsed.name}.png`);
  const inputBuffer = await readFile(inputPath);
  const inputBlob = new Blob([inputBuffer], {
    type: mimeByExtension[parsed.ext.toLowerCase()],
  });
  const { removeBackground } = await import("@imgly/background-removal-node");
  const resultBlob = await removeBackground(inputBlob, config);
  const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());

  await writeFile(outputPath, resultBuffer);
  console.log(`OK ${relativePath} -> transparent/${parsed.name}.png`);
}

if (process.argv[2] === "--single") {
  const relativePath = process.argv[3];
  if (!relativePath) {
    console.error("Missing image path for --single mode.");
    process.exit(1);
  }

  await processOne(relativePath);
  process.exit(0);
}

const images = await fg(imageGlobs, {
  cwd: assetsDir,
  onlyFiles: true,
  caseSensitiveMatch: false,
  ignore: ["transparent/**"],
});

if (images.length === 0) {
  console.log(`No image files found in ${assetsDir}`);
  process.exit(0);
}

console.log(`Removing backgrounds from ${images.length} image(s)...`);
const sharp = (await import("sharp")).default;

for (const relativePath of images) {
  const parsed = path.parse(relativePath);
  const outputPath = path.join(outputDir, `${parsed.name}.png`);
  const child = spawnSync(process.execPath, [scriptPath, "--single", relativePath], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);

  if (child.status !== 0) {
    console.error(`FAILED ${relativePath}`);
    process.exitCode = 1;
    continue;
  }

  const metadata = await sharp(outputPath).metadata();
  console.log(
    `VERIFIED transparent/${parsed.name}.png (${metadata.width}x${metadata.height}, alpha=${metadata.hasAlpha})`,
  );
}

if (process.exitCode) {
  console.error("Background removal completed with errors.");
} else {
  console.log("Background removal completed successfully.");
}
