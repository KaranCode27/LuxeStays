import fs from 'fs';

function run() {
  let seederText = fs.readFileSync('./utils/seeder.js', 'utf8');
  
  // Find all instances of images: ['URL'] and replace them sequentially
  // It's safer to just replace all images arrays
  let count = 0;
  seederText = seederText.replace(/images:\s*\[\s*['"][^'"]+['"]\s*\]/g, (match) => {
    count++;
    return `images: ['https://picsum.photos/seed/hotel_${count}/1000/600']`;
  });

  fs.writeFileSync('./utils/seeder.js', seederText);
  console.log(`Seeder file updated successfully! Replaced ${count} images.`);
}

run();
