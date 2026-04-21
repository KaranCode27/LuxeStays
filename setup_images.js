import fs from 'fs';
import path from 'path';

const hotelsDir = './Hotels/Hotels';
const targetDir = './HotelBookingWebsite/public/images/hotels';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const imageMap = {
  'Taj Lake Palace': 'Taj lake palace udaipur.avif',
  'Trident Udaipur': 'Trident Udaipur.jpg',
  'Hotel Udai Niwas': 'Trident Udaipur.jpg', // No image provided, sharing with another Udaipur hotel
  'The Himalayan': 'The Himalayan.jpg',
  'Solang Valley Resort': 'Solang Valley Resort.jpg',
  'Hotel Mountain Face': 'Span Resort & Spa.webp', // Mapping extra Manali hotel
  'The Leela Kovalam': 'The Leela Kovalam.jpg',
  'Taj Bekal Resort': 'Taj Bekal Resort & Spa.jpg',
  'Coconut Grove': 'Kumarakom Lake Resort.jpg', // Mapping extra Kerala hotel
  'Grand Dragon Ladakh': 'The Grand Dragon Ladakh.jpg',
  'The Zen Ladakh': 'The Zen Ladakh.jpg',
  'Zostel Ladakh': 'Ladakh Sarai Resort.jpg', // Mapping extra Ladakh hotel
  'Taj Exotica': 'Taj Exotica Resort & Spa.jpg',
  'Grand Hyatt Goa': 'Grand Hyatt Goa.jpg',
  'Calangute Residency': 'W Goa.jpg', // Mapping extra Goa hotel
  'Khyber Resort': 'Khyber Himalayan Resort.jpg',
  'Vivanta Dal View': 'Vivanta Dal View.jpg',
  'Hotel Hilltop': 'Hotel Hilltop.avif',
  'Oberoi Amarvilas': 'Oberoi Amarvilas.webp',
  'Taj Hotel Agra': 'Taj Hotel Agra.jpg',
  'Hotel Taj Resorts': 'taj resort.jpg'
};

const newImagePaths = {};

for(const [hotelName, fileName] of Object.entries(imageMap)) {
    const sourcePath = path.join(hotelsDir, fileName);
    if(fs.existsSync(sourcePath)) {
        const ext = path.extname(fileName);
        const newFileName = hotelName.replace(/[^a-zA-Z0-9 -]/g, "") + ext;
        const destPath = path.join(targetDir, newFileName);
        fs.copyFileSync(sourcePath, destPath);
        newImagePaths[hotelName] = `/images/hotels/${newFileName}`;
    } else {
       console.log("Missing image source: " + fileName);
    }
}

let seederText = fs.readFileSync('./utils/seeder.js', 'utf8');

for (const [name, imgUrl] of Object.entries(newImagePaths)) {
  let startIndex = seederText.indexOf("name: '" + name + "'");
  if (startIndex !== -1) {
     let imagesIndex = seederText.indexOf("images: [", startIndex);
     if (imagesIndex !== -1) {
        let closeBracket = seederText.indexOf("]", imagesIndex);
        let currentImagesStr = seederText.substring(imagesIndex, closeBracket + 1);
        let newImagesStr = "images: ['" + imgUrl + "']";
        seederText = seederText.replace(currentImagesStr, newImagesStr);
     }
  }
}
fs.writeFileSync('./utils/seeder.js', seederText);
console.log('Images Copied and Seeder Updated!');
