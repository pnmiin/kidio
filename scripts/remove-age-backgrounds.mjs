import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const scriptPath = fileURLToPath(import.meta.url);
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

const ageFiles = [
  "age5.png",
  "age6.png",
  "age7.png",
  "age8.png",
  "age9.png",
  "age10.png",
];

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

async function processOne(fileName) {
  const inputPath = path.join(assetsDir, fileName);
  const outputPath = path.join(outputDir, fileName);
  const inputBuffer = await readFile(inputPath);
  const inputBlob = new Blob([inputBuffer], { type: "image/png" });
  const { removeBackground } = await import("@imgly/background-removal-node");
  const resultBlob = await removeBackground(inputBlob, config);
  const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());

  await writeFile(outputPath, resultBuffer);
  console.log(`OK ${fileName} -> transparent/${fileName}`);
}

if (process.argv[2] === "--single") {
  const fileName = process.argv[3];
  if (!ageFiles.includes(fileName)) {
    console.error(`Unsupported age image: ${fileName}`);
    process.exit(1);
  }

  await processOne(fileName);
  process.exit(0);
}

console.log(`Removing backgrounds from ${ageFiles.length} age image(s)...`);
const sharp = (await import("sharp")).default;

for (const fileName of ageFiles) {
  const child = spawnSync(process.execPath, [scriptPath, "--single", fileName], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);

  if (child.status !== 0) {
    console.error(`FAILED ${fileName}`);
    process.exitCode = 1;
    continue;
  }

  const outputPath = path.join(outputDir, fileName);
  const metadata = await sharp(outputPath).metadata();
  console.log(
    `VERIFIED transparent/${fileName} (${metadata.width}x${metadata.height}, alpha=${metadata.hasAlpha})`,
  );
}

if (process.exitCode) {
  console.error("Age background removal completed with errors.");
} else {
  console.log("Age background removal completed successfully.");
}
