/**
 * Rasterizes the two brand SVG masters into every PNG/ICO asset the app
 * references. Run once whenever public/brand/logo-*.svg changes.
 *
 * Usage: node scripts/generate-logo-assets.cjs
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const toIco = require('to-ico');

const ROOT = path.join(__dirname, '..');
const MARK = path.join(ROOT, 'public/brand/logo-mark.svg');
const LOCKUP = path.join(ROOT, 'public/brand/logo-lockup.svg');

async function renderPng(svgPath, width, height, outPath) {
  await sharp(svgPath).resize(width, height).png().toFile(outPath);
  console.log('wrote', path.relative(ROOT, outPath));
}

async function run() {
  // Wide lockup — used by Header/Footer/LogoIntro (aspect ratio 960:492 == 480:246).
  await renderPng(LOCKUP, 960, 492, path.join(ROOT, 'public/images/logo.png'));

  // Square mark — general-purpose icon assets.
  await renderPng(MARK, 512, 512, path.join(ROOT, 'public/images/logo-icon.png'));
  await renderPng(MARK, 512, 512, path.join(ROOT, 'public/images/logo_bg.png'));
  await renderPng(MARK, 256, 256, path.join(ROOT, 'src/app/icon.png'));
  await renderPng(MARK, 180, 180, path.join(ROOT, 'src/app/apple-icon.png'));

  // favicon.ico — pack 16/32/48 px PNGs into one multi-resolution ICO.
  const sizes = [16, 32, 48];
  const tmpFiles = sizes.map((size) => path.join(ROOT, `.tmp-favicon-${size}.png`));
  try {
    for (let i = 0; i < sizes.length; i++) {
      await sharp(MARK).resize(sizes[i], sizes[i]).png().toFile(tmpFiles[i]);
    }
    const buffers = tmpFiles.map((f) => fs.readFileSync(f));
    const icoBuffer = await toIco(buffers);
    fs.writeFileSync(path.join(ROOT, 'src/app/favicon.ico'), icoBuffer);
    console.log('wrote src/app/favicon.ico');
  } finally {
    tmpFiles.forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
