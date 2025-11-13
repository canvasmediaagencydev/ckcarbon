const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/image/Logo.png');
const outputDir = path.join(__dirname, '../public');

// Favicon configurations
const faviconSizes = [
  { name: 'favicon.ico', size: 48, format: 'png' }, // Will be .png first, convert to .ico separately
  { name: 'favicon-48.png', size: 48, format: 'png' },
  { name: 'favicon-64.png', size: 64, format: 'png' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' },
];

// OG Image (social media share)
const ogImageConfig = {
  name: 'og-image.png',
  width: 1200,
  height: 630,
  format: 'png'
};

async function generateFavicons() {
  console.log('🎨 Generating favicons from CKlogo.png...\n');

  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found: ${sourceImage}`);
    }

    // Generate square favicons
    for (const config of faviconSizes) {
      const outputPath = path.join(outputDir, config.name);

      await sharp(sourceImage)
        .resize(config.size, config.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Created: ${config.name} (${config.size}x${config.size})`);
    }

    // Generate OG image (1200x630 with logo centered)
    const ogImagePath = path.join(outputDir, ogImageConfig.name);

    await sharp(sourceImage)
      .resize(400, 400, {
        fit: 'contain',
        background: { r: 22, g: 163, b: 74, alpha: 1 } // Green background
      })
      .extend({
        top: 115,
        bottom: 115,
        left: 400,
        right: 400,
        background: { r: 22, g: 163, b: 74, alpha: 1 }
      })
      .png()
      .toFile(ogImagePath);

    console.log(`✅ Created: ${ogImageConfig.name} (${ogImageConfig.width}x${ogImageConfig.height})`);

    // Create icon.svg (copy original if it's vector, or inform user)
    console.log('\n📝 Note: For icon.svg, please provide an SVG version of your logo for best quality.');
    console.log('   Alternatively, browsers will fallback to PNG versions.');

    console.log('\n🎉 All favicons generated successfully!');
    console.log('\n📦 Generated files:');
    faviconSizes.forEach(config => console.log(`   - public/${config.name}`));
    console.log(`   - public/${ogImageConfig.name}`);

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
