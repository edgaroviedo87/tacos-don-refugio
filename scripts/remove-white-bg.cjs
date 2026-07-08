/**
 * Remove white background from a PNG image.
 *
 * Requires jimp installed globally: npm install -g jimp
 *
 * Usage:
 *   node scripts/remove-white-bg.cjs <input.png> [output.png] [threshold]
 *
 * Arguments:
 *   input      Path to the source PNG (required)
 *   output     Path to write the result (default: overwrites input)
 *   threshold  0–255; pixels with R,G,B all >= this value become transparent (default: 230)
 *
 * Examples:
 *   node scripts/remove-white-bg.cjs public/images/logo.png
 *   node scripts/remove-white-bg.cjs public/images/logo.png public/images/logo-transparent.png
 *   node scripts/remove-white-bg.cjs public/images/logo.png public/images/logo.png 210
 */

const path = require('path');

const GLOBAL_MODULES = 'C:\\Users\\edgar-oviedow\\AppData\\Roaming\\npm\\node_modules';
const { Jimp } = require(path.join(GLOBAL_MODULES, 'jimp'));

const [,, input, output, rawThreshold] = process.argv;

if (!input) {
  console.error('Usage: node scripts/remove-white-bg.cjs <input.png> [output.png] [threshold]');
  process.exit(1);
}

const src  = path.resolve(input);
const dest = path.resolve(output || input);
const THRESHOLD = rawThreshold ? parseInt(rawThreshold, 10) : 230;

async function run() {
  const image = await Jimp.read(src);
  const { width, height } = image.bitmap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = image.bitmap.data[idx + 0];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
        image.bitmap.data[idx + 3] = 0;
      }
    }
  }

  await image.write(dest);
  console.log(`Done — ${width}x${height}px, threshold ${THRESHOLD} → ${dest}`);
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
