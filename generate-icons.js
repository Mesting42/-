const sharp = require('sharp');
const fs = require('fs');

const sizes = {
    'favicon.png': 32,
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512
};

async function generateIcons() {
    const svg = fs.readFileSync('favicon.svg');

    for (const [filename, size] of Object.entries(sizes)) {
        await sharp(svg)
            .resize(size, size)
            .png()
            .toFile(filename);

        console.log(`Generated ${filename}`);
    }
}

generateIcons().catch(console.error); 