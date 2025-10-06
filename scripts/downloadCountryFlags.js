const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to fetch HTML content
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filename);
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(filename)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file if error
      reject(err);
    });
  });
}

// Function to extract flags and country names
function extractFlagsAndNames(html) {
  const countries = [];
  
  // Look for images with class containing "h-[80px] w-[120px] object-contain"
  // and extract the following span with class "font-bold"
  
  // Pattern: <img ... class="...h-[80px] w-[120px] object-contain..." src="..." ...>
  // followed by <span class="font-bold">Country Name</span>
  
  const flagRegex = /<img[^>]*class="[^"]*h-\[80px\] w-\[120px\] object-contain[^"]*"[^>]*src="([^"]*)"[^>]*>/gi;
  const matches = html.matchAll(flagRegex);
  
  for (const match of matches) {
    const imgUrl = match[1];
    const imgIndex = match.index;
    
    // Find the next span with class "font-bold" after this image
    const afterImg = html.substring(imgIndex, imgIndex + 500);
    const nameMatch = afterImg.match(/<span[^>]*class="[^"]*font-bold[^"]*"[^>]*>([^<]+)<\/span>/i);
    
    if (nameMatch) {
      let countryName = nameMatch[1].trim();
      let imageUrl = imgUrl;
      
      // Make absolute URL if relative
      if (imageUrl.startsWith('/')) {
        imageUrl = 'https://www.worldometers.info' + imageUrl;
      } else if (!imageUrl.startsWith('http')) {
        imageUrl = 'https://www.worldometers.info/' + imageUrl;
      }
      
      // Clean up country name for filename
      const fileName = countryName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '-');
      
      if (countryName && imageUrl) {
        countries.push({ 
          name: countryName, 
          imageUrl: imageUrl,
          fileName: fileName
        });
      }
    }
  }
  
  return countries;
}

// Main function
async function main() {
  const url = 'https://www.worldometers.info/geography/flags-of-the-world/';
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'countries');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    console.log('Fetching page...');
    const html = await fetchPage(url);
    
    // Save HTML for debugging
    fs.writeFileSync(path.join(outputDir, 'page.html'), html);
    console.log('Saved HTML for debugging');
    
    console.log('Extracting flags and country names...');
    const countries = extractFlagsAndNames(html);
    
    console.log(`Found ${countries.length} countries to download`);
    
    if (countries.length === 0) {
      console.log('No countries found. Check the HTML structure.');
      return;
    }
    
    // Download images
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const ext = path.extname(country.imageUrl).split('?')[0] || '.png';
      const filename = path.join(outputDir, `${country.fileName}${ext}`);
      
      try {
        await downloadImage(country.imageUrl, filename);
      } catch (err) {
        console.error(`Failed to download ${country.name}:`, err.message);
      }
    }
    
    console.log('Done!');
    
    // Save metadata
    const metadata = countries.map(country => ({
      name: country.name,
      fileName: country.fileName,
      url: country.imageUrl
    }));
    
    fs.writeFileSync(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    console.log(`Metadata saved to ${path.join(outputDir, 'metadata.json')}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
