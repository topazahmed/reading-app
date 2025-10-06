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
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file if error
      reject(err);
    });
  });
}

// Function to extract images and text
function extractImagesAndText(html) {
  const items = [];
  
  // Look for images with class="image-tile" in noscript tags
  const noscriptRegex = /<noscript><img class="image-tile"[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*><\/noscript>/gi;
  const matches = html.matchAll(noscriptRegex);
  
  for (const match of matches) {
    let text = match[1].trim();
    let imageUrl = match[2];
    
    // Remove " - Road Sign" from the end
    text = text.replace(/\s*-\s*Road Sign\s*$/i, '');
    
    // Make absolute URL if relative
    if (imageUrl.startsWith('/')) {
      imageUrl = 'https://www.rhinocarhire.com' + imageUrl;
    }
    
    // Clean up text for filename
    text = text.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '-');
    
    if (text && imageUrl) {
      items.push({ text, imageUrl });
    }
  }
  
  return items;
}

// Main function
async function main() {
  const url = 'https://www.rhinocarhire.com/Drive-Smart-Blog/Drive-Smart-Canada/Canada-Road-Signs.aspx';
  const outputDir = path.join(__dirname, 'public', 'images', 'road-signs');
  
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
    
    console.log('Extracting images...');
    const items = extractImagesAndText(html);
    
    console.log(`Found ${items.length} images to download`);
    
    // Download images
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ext = path.extname(item.imageUrl).split('?')[0] || '.jpg';
      const filename = path.join(outputDir, `${item.text}${ext}`);
      
      try {
        await downloadImage(item.imageUrl, filename);
      } catch (err) {
        console.error(`Failed to download ${item.text}:`, err.message);
      }
    }
    
    console.log('Done!');
    
    // Save metadata
    const metadata = items.map(item => ({
      name: item.text,
      url: item.imageUrl
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
