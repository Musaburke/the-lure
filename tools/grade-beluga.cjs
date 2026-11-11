// The beluga photo was taken in a brightly lit aquarium; its blue fights the green-black deep.
// This grades the original (from Wikimedia Commons, CC BY 4.0, Versions111) into the site's deep-
// water green. Run once: node tools/grade-beluga.cjs <original.jpg>
const sharp = require('sharp');
const path = require('node:path');
sharp(process.argv[2])
  .rotate()
  .tint({ r: 132, g: 186, b: 164 })
  .modulate({ brightness: 0.9 })
  .jpeg({ quality: 92 })
  .toFile(path.resolve(__dirname, '../src/assets/zones/beluga.jpg'))
  .then((i) => console.log(i));
