# Countries Learning Module - Implementation Summary

## What Was Created

### 1. Downloaded Country Flags
- **Script**: `scripts/downloadCountryFlags.js`
- **Location**: `public/images/countries/`
- **Count**: 195 country flags from around the world
- **Source**: Worldometers.info (https://www.worldometers.info/geography/flags-of-the-world/)
- **Format**: Mostly GIF files, some PNG and JPG
- **Extraction Method**: Scraped using flag class name `h-[80px] w-[120px] object-contain` and country names from `font-bold` span elements

### 2. Created CountriesLearningModule Component
- **File**: `src/components/CountriesLearningModule.tsx`
- **Features**:
  - Displays random country flag from all 195 countries
  - Shows country flag in a card layout with proper aspect ratio
  - Speaks the country name when clicked (using Web Speech API)
  - Auto-refreshes to new random country after speaking (2-second delay)
  - Manual refresh button to show new country
  - No letter-by-letter functionality (direct country name learning)
  - Includes all countries from Afghanistan to Zimbabwe

### 3. Created SCSS Styling
- **File**: `src/components/CountriesLearningModule.scss`
- **Features**:
  - Responsive design for mobile, tablet, and desktop
  - Theme support (funky and solid themes)
  - Animated hover effects on cards and buttons
  - Flag container with 3:2 aspect ratio (300x200px standard)
  - Blue/green color scheme for buttons
  - Orange/red gradient for refresh button
  - Border around flags for better visibility

### 4. Integrated into Main App
- **File**: `src/App.tsx`
- **Changes**:
  - Added `countries` to mode types
  - Imported `CountriesLearningModule` component
  - Added "countries" option to learning mode dropdown
  - Updated URL hash handling for countries mode
  - Added conditional rendering for countries mode

## How to Use

1. **Select Mode**: Use the dropdown in the header to select "countries"
2. **View Flag**: A random country flag will be displayed
3. **Learn Name**: Click the country name button to hear it spoken
4. **Auto-Refresh**: After speaking, the module automatically shows a new country in 2 seconds
5. **Manual Refresh**: Click the "🔄 Show New Country! 🌍" button anytime

## All Countries Included (195 Total)

### By Region:

**Africa (54 countries):**
- Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cabo Verde, Cameroon, CAR, Chad, Comoros, Congo, DRC, Côte d'Ivoire, Djibouti, Egypt, Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Rwanda, Sao Tome and Principe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe

**Asia (48 countries):**
- Afghanistan, Armenia, Azerbaijan, Bahrain, Bangladesh, Bhutan, Brunei, Cambodia, China, Cyprus, Georgia, India, Indonesia, Iran, Iraq, Israel, Japan, Jordan, Kazakhstan, Kuwait, Kyrgyzstan, Laos, Lebanon, Malaysia, Maldives, Mongolia, Myanmar, Nepal, North Korea (DPRK), Oman, Pakistan, Palestine, Philippines, Qatar, Russia, Saudi Arabia, Singapore, South Korea, Sri Lanka, Syria, Tajikistan, Thailand, Timor-Leste, Turkey, Turkmenistan, U.A.E., Uzbekistan, Vietnam, Yemen

**Europe (44 countries):**
- Albania, Andorra, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Holy See, Hungary, Iceland, Ireland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Moldova, Monaco, Montenegro, Netherlands, North Macedonia, Norway, Poland, Portugal, Romania, San Marino, Serbia, Slovakia, Slovenia, Spain, Sweden, Switzerland, U.K., Ukraine

**North America (23 countries):**
- Antigua and Barbuda, Bahamas, Barbados, Belize, Canada, Costa Rica, Cuba, Dominica, Dominican Republic, El Salvador, Grenada, Guatemala, Haiti, Honduras, Jamaica, Mexico, Nicaragua, Panama, Saint Kitts and Nevis, Saint Lucia, St. Vincent Grenadines, Trinidad and Tobago, U.S.

**South America (12 countries):**
- Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela

**Oceania (14 countries):**
- Australia, Fiji, Kiribati, Marshall Islands, Micronesia, Nauru, New Zealand, Palau, Papua New Guinea, Samoa, Solomon Islands, Tonga, Tuvalu, Vanuatu

## Technical Details

- **Total Flags**: 195
- **Image Formats**: GIF (majority), PNG (2), JPG (1)
- **Storage**: Local public folder (offline-capable)
- **Speech**: Uses browser's Web Speech API
- **Responsive**: Works on all screen sizes
- **Themes**: Supports both funky (gradients) and solid (flat colors) themes
- **Flag Aspect Ratio**: Standardized 3:2 ratio (300x200px display size)

## Data Source

All country flags and names were downloaded from:
https://www.worldometers.info/geography/flags-of-the-world/

## Scraping Details

- **Flag Class**: `h-[80px] w-[120px] object-contain`
- **Name Class**: `font-bold` (in adjacent span element)
- **Script**: Node.js with HTTPS module
- **Method**: Regex extraction from HTML

## Features

- 🌍 Learn all 195 world countries
- 🎤 Text-to-speech pronunciation
- 🔄 Auto-refresh functionality
- 📱 Mobile-friendly responsive design
- 🎨 Beautiful gradient themes
- 🖼️ High-quality flag images
- ⚡ Fast local storage (no external dependencies at runtime)
