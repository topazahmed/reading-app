const https = require('https');
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

// Function to clean number strings
function cleanNumber(str) {
  if (!str) return null;
  return str.replace(/,/g, '').replace(/\$/g, '').trim();
}

// Function to extract country data from worldometers
async function getCountryData(countrySlug) {
  try {
    const url = `https://www.worldometers.info/world-population/${countrySlug}-population/`;
    const html = await fetchPage(url);
    
    const data = {
      population: null,
      landArea: null,
      density: null,
      capital: null,
      continent: null
    };
    
    // Extract population
    const popMatch = html.match(/Population[^>]*>([^<]+)</i);
    if (popMatch) {
      data.population = cleanNumber(popMatch[1]);
    }
    
    // Extract land area
    const areaMatch = html.match(/Land Area[^>]*>([^<]+)</i);
    if (areaMatch) {
      data.landArea = cleanNumber(areaMatch[1]);
    }
    
    // Extract density
    const densityMatch = html.match(/Density[^>]*>([^<]+)</i);
    if (densityMatch) {
      data.density = cleanNumber(densityMatch[1]);
    }
    
    return data;
  } catch (err) {
    console.error(`Error fetching data for ${countrySlug}:`, err.message);
    return null;
  }
}

// Comprehensive country data with continent, capital, and additional info
const countryData = {
  "Afghanistan": { continent: "Asia", capital: "Kabul", region: "South Asia", currency: "Afghan Afghani" },
  "Albania": { continent: "Europe", capital: "Tirana", region: "Southern Europe", currency: "Albanian Lek" },
  "Algeria": { continent: "Africa", capital: "Algiers", region: "North Africa", currency: "Algerian Dinar" },
  "Andorra": { continent: "Europe", capital: "Andorra la Vella", region: "Southern Europe", currency: "Euro" },
  "Angola": { continent: "Africa", capital: "Luanda", region: "Central Africa", currency: "Angolan Kwanza" },
  "Antigua and Barbuda": { continent: "North America", capital: "St. John's", region: "Caribbean", currency: "East Caribbean Dollar" },
  "Argentina": { continent: "South America", capital: "Buenos Aires", region: "South America", currency: "Argentine Peso" },
  "Armenia": { continent: "Asia", capital: "Yerevan", region: "Western Asia", currency: "Armenian Dram" },
  "Australia": { continent: "Oceania", capital: "Canberra", region: "Australia and New Zealand", currency: "Australian Dollar" },
  "Austria": { continent: "Europe", capital: "Vienna", region: "Western Europe", currency: "Euro" },
  "Azerbaijan": { continent: "Asia", capital: "Baku", region: "Western Asia", currency: "Azerbaijani Manat" },
  "Bahamas": { continent: "North America", capital: "Nassau", region: "Caribbean", currency: "Bahamian Dollar" },
  "Bahrain": { continent: "Asia", capital: "Manama", region: "Western Asia", currency: "Bahraini Dinar" },
  "Bangladesh": { continent: "Asia", capital: "Dhaka", region: "South Asia", currency: "Bangladeshi Taka" },
  "Barbados": { continent: "North America", capital: "Bridgetown", region: "Caribbean", currency: "Barbadian Dollar" },
  "Belarus": { continent: "Europe", capital: "Minsk", region: "Eastern Europe", currency: "Belarusian Ruble" },
  "Belgium": { continent: "Europe", capital: "Brussels", region: "Western Europe", currency: "Euro" },
  "Belize": { continent: "North America", capital: "Belmopan", region: "Central America", currency: "Belize Dollar" },
  "Benin": { continent: "Africa", capital: "Porto-Novo", region: "West Africa", currency: "West African CFA Franc" },
  "Bhutan": { continent: "Asia", capital: "Thimphu", region: "South Asia", currency: "Bhutanese Ngultrum" },
  "Bolivia": { continent: "South America", capital: "Sucre", region: "South America", currency: "Bolivian Boliviano" },
  "Bosnia and Herzegovina": { continent: "Europe", capital: "Sarajevo", region: "Southern Europe", currency: "Bosnia and Herzegovina Convertible Mark" },
  "Botswana": { continent: "Africa", capital: "Gaborone", region: "Southern Africa", currency: "Botswana Pula" },
  "Brazil": { continent: "South America", capital: "Brasília", region: "South America", currency: "Brazilian Real" },
  "Brunei": { continent: "Asia", capital: "Bandar Seri Begawan", region: "Southeast Asia", currency: "Brunei Dollar" },
  "Bulgaria": { continent: "Europe", capital: "Sofia", region: "Eastern Europe", currency: "Bulgarian Lev" },
  "Burkina Faso": { continent: "Africa", capital: "Ouagadougou", region: "West Africa", currency: "West African CFA Franc" },
  "Burundi": { continent: "Africa", capital: "Gitega", region: "East Africa", currency: "Burundian Franc" },
  "Cabo Verde": { continent: "Africa", capital: "Praia", region: "West Africa", currency: "Cape Verdean Escudo" },
  "Cambodia": { continent: "Asia", capital: "Phnom Penh", region: "Southeast Asia", currency: "Cambodian Riel" },
  "Cameroon": { continent: "Africa", capital: "Yaoundé", region: "Central Africa", currency: "Central African CFA Franc" },
  "Canada": { continent: "North America", capital: "Ottawa", region: "North America", currency: "Canadian Dollar" },
  "CAR": { continent: "Africa", capital: "Bangui", region: "Central Africa", currency: "Central African CFA Franc", fullName: "Central African Republic" },
  "Chad": { continent: "Africa", capital: "N'Djamena", region: "Central Africa", currency: "Central African CFA Franc" },
  "Chile": { continent: "South America", capital: "Santiago", region: "South America", currency: "Chilean Peso" },
  "China": { continent: "Asia", capital: "Beijing", region: "East Asia", currency: "Chinese Yuan" },
  "Colombia": { continent: "South America", capital: "Bogotá", region: "South America", currency: "Colombian Peso" },
  "Comoros": { continent: "Africa", capital: "Moroni", region: "East Africa", currency: "Comorian Franc" },
  "Congo": { continent: "Africa", capital: "Brazzaville", region: "Central Africa", currency: "Central African CFA Franc", fullName: "Republic of the Congo" },
  "Costa Rica": { continent: "North America", capital: "San José", region: "Central America", currency: "Costa Rican Colón" },
  "Croatia": { continent: "Europe", capital: "Zagreb", region: "Southern Europe", currency: "Euro" },
  "Cuba": { continent: "North America", capital: "Havana", region: "Caribbean", currency: "Cuban Peso" },
  "Cyprus": { continent: "Europe", capital: "Nicosia", region: "Southern Europe", currency: "Euro" },
  "Czechia": { continent: "Europe", capital: "Prague", region: "Eastern Europe", currency: "Czech Koruna" },
  "Denmark": { continent: "Europe", capital: "Copenhagen", region: "Northern Europe", currency: "Danish Krone" },
  "Djibouti": { continent: "Africa", capital: "Djibouti", region: "East Africa", currency: "Djiboutian Franc" },
  "Dominica": { continent: "North America", capital: "Roseau", region: "Caribbean", currency: "East Caribbean Dollar" },
  "Dominican Republic": { continent: "North America", capital: "Santo Domingo", region: "Caribbean", currency: "Dominican Peso" },
  "DPRK": { continent: "Asia", capital: "Pyongyang", region: "East Asia", currency: "North Korean Won", fullName: "North Korea" },
  "DRC": { continent: "Africa", capital: "Kinshasa", region: "Central Africa", currency: "Congolese Franc", fullName: "Democratic Republic of the Congo" },
  "Ecuador": { continent: "South America", capital: "Quito", region: "South America", currency: "United States Dollar" },
  "Egypt": { continent: "Africa", capital: "Cairo", region: "North Africa", currency: "Egyptian Pound" },
  "El Salvador": { continent: "North America", capital: "San Salvador", region: "Central America", currency: "United States Dollar" },
  "Equatorial Guinea": { continent: "Africa", capital: "Malabo", region: "Central Africa", currency: "Central African CFA Franc" },
  "Eritrea": { continent: "Africa", capital: "Asmara", region: "East Africa", currency: "Eritrean Nakfa" },
  "Estonia": { continent: "Europe", capital: "Tallinn", region: "Northern Europe", currency: "Euro" },
  "Eswatini": { continent: "Africa", capital: "Mbabane", region: "Southern Africa", currency: "Swazi Lilangeni" },
  "Ethiopia": { continent: "Africa", capital: "Addis Ababa", region: "East Africa", currency: "Ethiopian Birr" },
  "Fiji": { continent: "Oceania", capital: "Suva", region: "Melanesia", currency: "Fijian Dollar" },
  "Finland": { continent: "Europe", capital: "Helsinki", region: "Northern Europe", currency: "Euro" },
  "France": { continent: "Europe", capital: "Paris", region: "Western Europe", currency: "Euro" },
  "Gabon": { continent: "Africa", capital: "Libreville", region: "Central Africa", currency: "Central African CFA Franc" },
  "Gambia": { continent: "Africa", capital: "Banjul", region: "West Africa", currency: "Gambian Dalasi" },
  "Georgia": { continent: "Asia", capital: "Tbilisi", region: "Western Asia", currency: "Georgian Lari" },
  "Germany": { continent: "Europe", capital: "Berlin", region: "Western Europe", currency: "Euro" },
  "Ghana": { continent: "Africa", capital: "Accra", region: "West Africa", currency: "Ghanaian Cedi" },
  "Greece": { continent: "Europe", capital: "Athens", region: "Southern Europe", currency: "Euro" },
  "Grenada": { continent: "North America", capital: "St. George's", region: "Caribbean", currency: "East Caribbean Dollar" },
  "Guatemala": { continent: "North America", capital: "Guatemala City", region: "Central America", currency: "Guatemalan Quetzal" },
  "Guinea": { continent: "Africa", capital: "Conakry", region: "West Africa", currency: "Guinean Franc" },
  "Guinea-Bissau": { continent: "Africa", capital: "Bissau", region: "West Africa", currency: "West African CFA Franc" },
  "Guyana": { continent: "South America", capital: "Georgetown", region: "South America", currency: "Guyanese Dollar" },
  "Haiti": { continent: "North America", capital: "Port-au-Prince", region: "Caribbean", currency: "Haitian Gourde" },
  "Holy See": { continent: "Europe", capital: "Vatican City", region: "Southern Europe", currency: "Euro", fullName: "Vatican City" },
  "Honduras": { continent: "North America", capital: "Tegucigalpa", region: "Central America", currency: "Honduran Lempira" },
  "Hungary": { continent: "Europe", capital: "Budapest", region: "Eastern Europe", currency: "Hungarian Forint" },
  "Iceland": { continent: "Europe", capital: "Reykjavik", region: "Northern Europe", currency: "Icelandic Króna" },
  "India": { continent: "Asia", capital: "New Delhi", region: "South Asia", currency: "Indian Rupee" },
  "Indonesia": { continent: "Asia", capital: "Jakarta", region: "Southeast Asia", currency: "Indonesian Rupiah" },
  "Iran": { continent: "Asia", capital: "Tehran", region: "Western Asia", currency: "Iranian Rial" },
  "Iraq": { continent: "Asia", capital: "Baghdad", region: "Western Asia", currency: "Iraqi Dinar" },
  "Ireland": { continent: "Europe", capital: "Dublin", region: "Northern Europe", currency: "Euro" },
  "Israel": { continent: "Asia", capital: "Jerusalem", region: "Western Asia", currency: "Israeli New Shekel" },
  "Italy": { continent: "Europe", capital: "Rome", region: "Southern Europe", currency: "Euro" },
  "Jamaica": { continent: "North America", capital: "Kingston", region: "Caribbean", currency: "Jamaican Dollar" },
  "Japan": { continent: "Asia", capital: "Tokyo", region: "East Asia", currency: "Japanese Yen" },
  "Jordan": { continent: "Asia", capital: "Amman", region: "Western Asia", currency: "Jordanian Dinar" },
  "Kazakhstan": { continent: "Asia", capital: "Astana", region: "Central Asia", currency: "Kazakhstani Tenge" },
  "Kenya": { continent: "Africa", capital: "Nairobi", region: "East Africa", currency: "Kenyan Shilling" },
  "Kiribati": { continent: "Oceania", capital: "Tarawa", region: "Micronesia", currency: "Australian Dollar" },
  "Kuwait": { continent: "Asia", capital: "Kuwait City", region: "Western Asia", currency: "Kuwaiti Dinar" },
  "Kyrgyzstan": { continent: "Asia", capital: "Bishkek", region: "Central Asia", currency: "Kyrgyzstani Som" },
  "Laos": { continent: "Asia", capital: "Vientiane", region: "Southeast Asia", currency: "Lao Kip" },
  "Latvia": { continent: "Europe", capital: "Riga", region: "Northern Europe", currency: "Euro" },
  "Lebanon": { continent: "Asia", capital: "Beirut", region: "Western Asia", currency: "Lebanese Pound" },
  "Lesotho": { continent: "Africa", capital: "Maseru", region: "Southern Africa", currency: "Lesotho Loti" },
  "Liberia": { continent: "Africa", capital: "Monrovia", region: "West Africa", currency: "Liberian Dollar" },
  "Libya": { continent: "Africa", capital: "Tripoli", region: "North Africa", currency: "Libyan Dinar" },
  "Liechtenstein": { continent: "Europe", capital: "Vaduz", region: "Western Europe", currency: "Swiss Franc" },
  "Lithuania": { continent: "Europe", capital: "Vilnius", region: "Northern Europe", currency: "Euro" },
  "Luxembourg": { continent: "Europe", capital: "Luxembourg", region: "Western Europe", currency: "Euro" },
  "Madagascar": { continent: "Africa", capital: "Antananarivo", region: "East Africa", currency: "Malagasy Ariary" },
  "Malawi": { continent: "Africa", capital: "Lilongwe", region: "East Africa", currency: "Malawian Kwacha" },
  "Malaysia": { continent: "Asia", capital: "Kuala Lumpur", region: "Southeast Asia", currency: "Malaysian Ringgit" },
  "Maldives": { continent: "Asia", capital: "Malé", region: "South Asia", currency: "Maldivian Rufiyaa" },
  "Mali": { continent: "Africa", capital: "Bamako", region: "West Africa", currency: "West African CFA Franc" },
  "Malta": { continent: "Europe", capital: "Valletta", region: "Southern Europe", currency: "Euro" },
  "Marshall Islands": { continent: "Oceania", capital: "Majuro", region: "Micronesia", currency: "United States Dollar" },
  "Mauritania": { continent: "Africa", capital: "Nouakchott", region: "West Africa", currency: "Mauritanian Ouguiya" },
  "Mauritius": { continent: "Africa", capital: "Port Louis", region: "East Africa", currency: "Mauritian Rupee" },
  "Mexico": { continent: "North America", capital: "Mexico City", region: "Central America", currency: "Mexican Peso" },
  "Micronesia": { continent: "Oceania", capital: "Palikir", region: "Micronesia", currency: "United States Dollar" },
  "Moldova": { continent: "Europe", capital: "Chișinău", region: "Eastern Europe", currency: "Moldovan Leu" },
  "Monaco": { continent: "Europe", capital: "Monaco", region: "Western Europe", currency: "Euro" },
  "Mongolia": { continent: "Asia", capital: "Ulaanbaatar", region: "East Asia", currency: "Mongolian Tögrög" },
  "Montenegro": { continent: "Europe", capital: "Podgorica", region: "Southern Europe", currency: "Euro" },
  "Morocco": { continent: "Africa", capital: "Rabat", region: "North Africa", currency: "Moroccan Dirham" },
  "Mozambique": { continent: "Africa", capital: "Maputo", region: "East Africa", currency: "Mozambican Metical" },
  "Myanmar": { continent: "Asia", capital: "Naypyidaw", region: "Southeast Asia", currency: "Myanmar Kyat" },
  "Namibia": { continent: "Africa", capital: "Windhoek", region: "Southern Africa", currency: "Namibian Dollar" },
  "Nauru": { continent: "Oceania", capital: "Yaren", region: "Micronesia", currency: "Australian Dollar" },
  "Nepal": { continent: "Asia", capital: "Kathmandu", region: "South Asia", currency: "Nepalese Rupee" },
  "Netherlands": { continent: "Europe", capital: "Amsterdam", region: "Western Europe", currency: "Euro" },
  "New Zealand": { continent: "Oceania", capital: "Wellington", region: "Australia and New Zealand", currency: "New Zealand Dollar" },
  "Nicaragua": { continent: "North America", capital: "Managua", region: "Central America", currency: "Nicaraguan Córdoba" },
  "Niger": { continent: "Africa", capital: "Niamey", region: "West Africa", currency: "West African CFA Franc" },
  "Nigeria": { continent: "Africa", capital: "Abuja", region: "West Africa", currency: "Nigerian Naira" },
  "North Macedonia": { continent: "Europe", capital: "Skopje", region: "Southern Europe", currency: "Macedonian Denar" },
  "Norway": { continent: "Europe", capital: "Oslo", region: "Northern Europe", currency: "Norwegian Krone" },
  "Oman": { continent: "Asia", capital: "Muscat", region: "Western Asia", currency: "Omani Rial" },
  "Pakistan": { continent: "Asia", capital: "Islamabad", region: "South Asia", currency: "Pakistani Rupee" },
  "Palau": { continent: "Oceania", capital: "Ngerulmud", region: "Micronesia", currency: "United States Dollar" },
  "Panama": { continent: "North America", capital: "Panama City", region: "Central America", currency: "Panamanian Balboa" },
  "Papua New Guinea": { continent: "Oceania", capital: "Port Moresby", region: "Melanesia", currency: "Papua New Guinean Kina" },
  "Paraguay": { continent: "South America", capital: "Asunción", region: "South America", currency: "Paraguayan Guaraní" },
  "Peru": { continent: "South America", capital: "Lima", region: "South America", currency: "Peruvian Sol" },
  "Philippines": { continent: "Asia", capital: "Manila", region: "Southeast Asia", currency: "Philippine Peso" },
  "Poland": { continent: "Europe", capital: "Warsaw", region: "Eastern Europe", currency: "Polish Złoty" },
  "Portugal": { continent: "Europe", capital: "Lisbon", region: "Southern Europe", currency: "Euro" },
  "Qatar": { continent: "Asia", capital: "Doha", region: "Western Asia", currency: "Qatari Riyal" },
  "Romania": { continent: "Europe", capital: "Bucharest", region: "Eastern Europe", currency: "Romanian Leu" },
  "Russia": { continent: "Europe", capital: "Moscow", region: "Eastern Europe", currency: "Russian Ruble" },
  "Rwanda": { continent: "Africa", capital: "Kigali", region: "East Africa", currency: "Rwandan Franc" },
  "Saint Kitts and Nevis": { continent: "North America", capital: "Basseterre", region: "Caribbean", currency: "East Caribbean Dollar" },
  "Saint Lucia": { continent: "North America", capital: "Castries", region: "Caribbean", currency: "East Caribbean Dollar" },
  "Samoa": { continent: "Oceania", capital: "Apia", region: "Polynesia", currency: "Samoan Tālā" },
  "San Marino": { continent: "Europe", capital: "San Marino", region: "Southern Europe", currency: "Euro" },
  "Sao Tome and Principe": { continent: "Africa", capital: "São Tomé", region: "Central Africa", currency: "São Tomé and Príncipe Dobra" },
  "Saudi Arabia": { continent: "Asia", capital: "Riyadh", region: "Western Asia", currency: "Saudi Riyal" },
  "Senegal": { continent: "Africa", capital: "Dakar", region: "West Africa", currency: "West African CFA Franc" },
  "Serbia": { continent: "Europe", capital: "Belgrade", region: "Southern Europe", currency: "Serbian Dinar" },
  "Seychelles": { continent: "Africa", capital: "Victoria", region: "East Africa", currency: "Seychellois Rupee" },
  "Sierra Leone": { continent: "Africa", capital: "Freetown", region: "West Africa", currency: "Sierra Leonean Leone" },
  "Singapore": { continent: "Asia", capital: "Singapore", region: "Southeast Asia", currency: "Singapore Dollar" },
  "Slovakia": { continent: "Europe", capital: "Bratislava", region: "Eastern Europe", currency: "Euro" },
  "Slovenia": { continent: "Europe", capital: "Ljubljana", region: "Southern Europe", currency: "Euro" },
  "Solomon Islands": { continent: "Oceania", capital: "Honiara", region: "Melanesia", currency: "Solomon Islands Dollar" },
  "Somalia": { continent: "Africa", capital: "Mogadishu", region: "East Africa", currency: "Somali Shilling" },
  "South Africa": { continent: "Africa", capital: "Pretoria", region: "Southern Africa", currency: "South African Rand" },
  "South Korea": { continent: "Asia", capital: "Seoul", region: "East Asia", currency: "South Korean Won" },
  "South Sudan": { continent: "Africa", capital: "Juba", region: "East Africa", currency: "South Sudanese Pound" },
  "Spain": { continent: "Europe", capital: "Madrid", region: "Southern Europe", currency: "Euro" },
  "Sri Lanka": { continent: "Asia", capital: "Colombo", region: "South Asia", currency: "Sri Lankan Rupee" },
  "St. Vincent Grenadines": { continent: "North America", capital: "Kingstown", region: "Caribbean", currency: "East Caribbean Dollar" },
  "State of Palestine": { continent: "Asia", capital: "Ramallah", region: "Western Asia", currency: "Israeli New Shekel" },
  "Sudan": { continent: "Africa", capital: "Khartoum", region: "North Africa", currency: "Sudanese Pound" },
  "Suriname": { continent: "South America", capital: "Paramaribo", region: "South America", currency: "Surinamese Dollar" },
  "Sweden": { continent: "Europe", capital: "Stockholm", region: "Northern Europe", currency: "Swedish Krona" },
  "Switzerland": { continent: "Europe", capital: "Bern", region: "Western Europe", currency: "Swiss Franc" },
  "Syria": { continent: "Asia", capital: "Damascus", region: "Western Asia", currency: "Syrian Pound" },
  "Tajikistan": { continent: "Asia", capital: "Dushanbe", region: "Central Asia", currency: "Tajikistani Somoni" },
  "Tanzania": { continent: "Africa", capital: "Dodoma", region: "East Africa", currency: "Tanzanian Shilling" },
  "Thailand": { continent: "Asia", capital: "Bangkok", region: "Southeast Asia", currency: "Thai Baht" },
  "Timor-Leste": { continent: "Asia", capital: "Dili", region: "Southeast Asia", currency: "United States Dollar" },
  "Togo": { continent: "Africa", capital: "Lomé", region: "West Africa", currency: "West African CFA Franc" },
  "Tonga": { continent: "Oceania", capital: "Nuku'alofa", region: "Polynesia", currency: "Tongan Paʻanga" },
  "Trinidad and Tobago": { continent: "North America", capital: "Port of Spain", region: "Caribbean", currency: "Trinidad and Tobago Dollar" },
  "Tunisia": { continent: "Africa", capital: "Tunis", region: "North Africa", currency: "Tunisian Dinar" },
  "Turkey": { continent: "Asia", capital: "Ankara", region: "Western Asia", currency: "Turkish Lira" },
  "Turkmenistan": { continent: "Asia", capital: "Ashgabat", region: "Central Asia", currency: "Turkmenistan Manat" },
  "Tuvalu": { continent: "Oceania", capital: "Funafuti", region: "Polynesia", currency: "Australian Dollar" },
  "U.A.E.": { continent: "Asia", capital: "Abu Dhabi", region: "Western Asia", currency: "UAE Dirham", fullName: "United Arab Emirates" },
  "U.K.": { continent: "Europe", capital: "London", region: "Northern Europe", currency: "Pound Sterling", fullName: "United Kingdom" },
  "U.S.": { continent: "North America", capital: "Washington, D.C.", region: "North America", currency: "United States Dollar", fullName: "United States" },
  "Uganda": { continent: "Africa", capital: "Kampala", region: "East Africa", currency: "Ugandan Shilling" },
  "Ukraine": { continent: "Europe", capital: "Kyiv", region: "Eastern Europe", currency: "Ukrainian Hryvnia" },
  "Uruguay": { continent: "South America", capital: "Montevideo", region: "South America", currency: "Uruguayan Peso" },
  "Uzbekistan": { continent: "Asia", capital: "Tashkent", region: "Central Asia", currency: "Uzbekistani Som" },
  "Vanuatu": { continent: "Oceania", capital: "Port Vila", region: "Melanesia", currency: "Vanuatu Vatu" },
  "Venezuela": { continent: "South America", capital: "Caracas", region: "South America", currency: "Venezuelan Bolívar" },
  "Vietnam": { continent: "Asia", capital: "Hanoi", region: "Southeast Asia", currency: "Vietnamese Đồng" },
  "Yemen": { continent: "Asia", capital: "Sana'a", region: "Western Asia", currency: "Yemeni Rial" },
  "Zambia": { continent: "Africa", capital: "Lusaka", region: "East Africa", currency: "Zambian Kwacha" },
  "Zimbabwe": { continent: "Africa", capital: "Harare", region: "East Africa", currency: "Zimbabwean Dollar" }
};

// Approximate population and land area data (2024 estimates)
const statsData = {
  "Afghanistan": { population: "41,128,771", landArea: "652,230 km²", gdpPerCapita: "$368" },
  "Albania": { population: "2,842,321", landArea: "28,748 km²", gdpPerCapita: "$6,494" },
  "Algeria": { population: "44,903,225", landArea: "2,381,741 km²", gdpPerCapita: "$3,765" },
  "Andorra": { population: "79,824", landArea: "468 km²", gdpPerCapita: "$46,000" },
  "Angola": { population: "35,588,987", landArea: "1,246,700 km²", gdpPerCapita: "$2,036" },
  "Antigua and Barbuda": { population: "93,219", landArea: "442 km²", gdpPerCapita: "$18,817" },
  "Argentina": { population: "45,510,318", landArea: "2,780,400 km²", gdpPerCapita: "$10,636" },
  "Armenia": { population: "2,777,970", landArea: "29,743 km²", gdpPerCapita: "$5,272" },
  "Australia": { population: "26,439,111", landArea: "7,692,024 km²", gdpPerCapita: "$63,529" },
  "Austria": { population: "8,95,927", landArea: "83,871 km²", gdpPerCapita: "$53,268" },
  "Azerbaijan": { population: "10,358,074", landArea: "86,600 km²", gdpPerCapita: "$5,500" },
  "Bahamas": { population: "409,984", landArea: "13,943 km²", gdpPerCapita: "$33,494" },
  "Bahrain": { population: "1,472,233", landArea: "765 km²", gdpPerCapita: "$27,822" },
  "Bangladesh": { population: "172,954,319", landArea: "148,460 km²", gdpPerCapita: "$2,688" },
  "Barbados": { population: "281,635", landArea: "430 km²", gdpPerCapita: "$19,143" },
  "Belarus": { population: "9,498,238", landArea: "207,600 km²", gdpPerCapita: "$7,302" },
  "Belgium": { population: "11,686,140", landArea: "30,528 km²", gdpPerCapita: "$50,114" },
  "Belize": { population: "405,272", landArea: "22,966 km²", gdpPerCapita: "$5,268" },
  "Benin": { population: "13,352,864", landArea: "114,763 km²", gdpPerCapita: "$1,428" },
  "Bhutan": { population: "787,424", landArea: "38,394 km²", gdpPerCapita: "$3,595" },
  "Bolivia": { population: "12,224,110", landArea: "1,098,581 km²", gdpPerCapita: "$3,552" },
  "Bosnia and Herzegovina": { population: "3,210,847", landArea: "51,209 km²", gdpPerCapita: "$7,032" },
  "Botswana": { population: "2,630,296", landArea: "581,730 km²", gdpPerCapita: "$8,093" },
  "Brazil": { population: "216,422,446", landArea: "8,515,767 km²", gdpPerCapita: "$8,918" },
  "Brunei": { population: "449,002", landArea: "5,765 km²", gdpPerCapita: "$31,449" },
  "Bulgaria": { population: "6,687,717", landArea: "110,879 km²", gdpPerCapita: "$12,795" },
  "Burkina Faso": { population: "22,673,762", landArea: "272,967 km²", gdpPerCapita: "$893" },
  "Burundi": { population: "12,889,576", landArea: "27,834 km²", gdpPerCapita: "$237" },
  "Cabo Verde": { population: "593,149", landArea: "4,033 km²", gdpPerCapita: "$4,200" },
  "Cambodia": { population: "16,944,826", landArea: "181,035 km²", gdpPerCapita: "$1,785" },
  "Cameroon": { population: "28,647,293", landArea: "475,442 km²", gdpPerCapita: "$1,655" },
  "Canada": { population: "38,781,291", landArea: "9,984,670 km²", gdpPerCapita: "$52,051" },
  "CAR": { population: "5,579,144", landArea: "622,984 km²", gdpPerCapita: "$511" },
  "Chad": { population: "18,278,568", landArea: "1,284,000 km²", gdpPerCapita: "$696" },
  "Chile": { population: "19,603,733", landArea: "756,102 km²", gdpPerCapita: "$15,355" },
  "China": { population: "1,425,671,352", landArea: "9,596,961 km²", gdpPerCapita: "$12,720" },
  "Colombia": { population: "52,085,168", landArea: "1,141,748 km²", gdpPerCapita: "$6,630" },
  "Comoros": { population: "836,774", landArea: "1,862 km²", gdpPerCapita: "$1,560" },
  "Congo": { population: "6,106,869", landArea: "342,000 km²", gdpPerCapita: "$1,698" },
  "Costa Rica": { population: "5,180,829", landArea: "51,100 km²", gdpPerCapita: "$13,014" },
  "Croatia": { population: "3,871,833", landArea: "56,594 km²", gdpPerCapita: "$18,686" },
  "Cuba": { population: "11,212,191", landArea: "109,884 km²", gdpPerCapita: "$9,500" },
  "Cyprus": { population: "1,260,138", landArea: "9,251 km²", gdpPerCapita: "$32,415" },
  "Czechia": { population: "10,495,295", landArea: "78,865 km²", gdpPerCapita: "$27,190" },
  "Denmark": { population: "5,910,913", landArea: "42,933 km²", gdpPerCapita: "$68,008" },
  "Djibouti": { population: "1,136,455", landArea: "23,200 km²", gdpPerCapita: "$3,425" },
  "Dominica": { population: "72,737", landArea: "751 km²", gdpPerCapita: "$9,726" },
  "Dominican Republic": { population: "11,332,972", landArea: "48,671 km²", gdpPerCapita: "$9,926" },
  "DPRK": { population: "26,069,416", landArea: "120,538 km²", gdpPerCapita: "$1,300" },
  "DRC": { population: "102,262,808", landArea: "2,344,858 km²", gdpPerCapita: "$584" },
  "Ecuador": { population: "18,190,484", landArea: "276,841 km²", gdpPerCapita: "$6,296" },
  "Egypt": { population: "110,990,103", landArea: "1,002,450 km²", gdpPerCapita: "$4,295" },
  "El Salvador": { population: "6,364,943", landArea: "21,041 km²", gdpPerCapita: "$4,957" },
  "Equatorial Guinea": { population: "1,714,671", landArea: "28,051 km²", gdpPerCapita: "$8,132" },
  "Eritrea": { population: "3,684,032", landArea: "117,600 km²", gdpPerCapita: "$700" },
  "Estonia": { population: "1,322,765", landArea: "45,227 km²", gdpPerCapita: "$27,943" },
  "Eswatini": { population: "1,210,822", landArea: "17,364 km²", gdpPerCapita: "$4,146" },
  "Ethiopia": { population: "126,527,060", landArea: "1,104,300 km²", gdpPerCapita: "$1,020" },
  "Fiji": { population: "929,766", landArea: "18,272 km²", gdpPerCapita: "$5,740" },
  "Finland": { population: "5,545,475", landArea: "338,424 km²", gdpPerCapita: "$53,654" },
  "France": { population: "64,756,584", landArea: "643,801 km²", gdpPerCapita: "$44,408" },
  "Gabon": { population: "2,388,992", landArea: "267,668 km²", gdpPerCapita: "$8,017" },
  "Gambia": { population: "2,705,992", landArea: "11,295 km²", gdpPerCapita: "$772" },
  "Georgia": { population: "3,744,385", landArea: "69,700 km²", gdpPerCapita: "$6,628" },
  "Germany": { population: "83,294,633", landArea: "357,022 km²", gdpPerCapita: "$51,203" },
  "Ghana": { population: "34,121,985", landArea: "238,533 km²", gdpPerCapita: "$2,445" },
  "Greece": { population: "10,341,277", landArea: "131,957 km²", gdpPerCapita: "$20,192" },
  "Grenada": { population: "125,438", landArea: "344 km²", gdpPerCapita: "$11,593" },
  "Guatemala": { population: "18,092,026", landArea: "108,889 km²", gdpPerCapita: "$5,025" },
  "Guinea": { population: "14,190,612", landArea: "245,857 km²", gdpPerCapita: "$1,175" },
  "Guinea-Bissau": { population: "2,150,842", landArea: "36,125 km²", gdpPerCapita: "$852" },
  "Guyana": { population: "808,726", landArea: "214,969 km²", gdpPerCapita: "$15,845" },
  "Haiti": { population: "11,724,763", landArea: "27,750 km²", gdpPerCapita: "$1,815" },
  "Holy See": { population: "518", landArea: "0.44 km²", gdpPerCapita: "N/A" },
  "Honduras": { population: "10,432,860", landArea: "112,492 km²", gdpPerCapita: "$2,830" },
  "Hungary": { population: "9,606,259", landArea: "93,028 km²", gdpPerCapita: "$18,773" },
  "Iceland": { population: "375,318", landArea: "103,000 km²", gdpPerCapita: "$73,784" },
  "India": { population: "1,428,627,663", landArea: "3,287,263 km²", gdpPerCapita: "$2,612" },
  "Indonesia": { population: "277,534,122", landArea: "1,904,569 km²", gdpPerCapita: "$4,788" },
  "Iran": { population: "89,172,767", landArea: "1,648,195 km²", gdpPerCapita: "$4,388" },
  "Iraq": { population: "45,504,560", landArea: "438,317 km²", gdpPerCapita: "$5,358" },
  "Ireland": { population: "5,056,935", landArea: "70,273 km²", gdpPerCapita: "$99,239" },
  "Israel": { population: "9,174,520", landArea: "20,770 km²", gdpPerCapita: "$54,660" },
  "Italy": { population: "58,870,762", landArea: "301,340 km²", gdpPerCapita: "$35,551" },
  "Jamaica": { population: "2,825,544", landArea: "10,991 km²", gdpPerCapita: "$5,582" },
  "Japan": { population: "123,294,513", landArea: "377,930 km²", gdpPerCapita: "$33,950" },
  "Jordan": { population: "11,285,869", landArea: "89,342 km²", gdpPerCapita: "$4,405" },
  "Kazakhstan": { population: "19,606,633", landArea: "2,724,900 km²", gdpPerCapita: "$10,373" },
  "Kenya": { population: "55,100,586", landArea: "580,367 km²", gdpPerCapita: "$2,099" },
  "Kiribati": { population: "131,232", landArea: "811 km²", gdpPerCapita: "$1,927" },
  "Kuwait": { population: "4,310,108", landArea: "17,818 km²", gdpPerCapita: "$28,104" },
  "Kyrgyzstan": { population: "7,036,075", landArea: "199,951 km²", gdpPerCapita: "$1,485" },
  "Laos": { population: "7,749,595", landArea: "236,800 km²", gdpPerCapita: "$2,551" },
  "Latvia": { population: "1,830,211", landArea: "64,559 km²", gdpPerCapita: "$21,150" },
  "Lebanon": { population: "5,489,739", landArea: "10,452 km²", gdpPerCapita: "$2,955" },
  "Lesotho": { population: "2,306,000", landArea: "30,355 km²", gdpPerCapita: "$1,118" },
  "Liberia": { population: "5,418,377", landArea: "111,369 km²", gdpPerCapita: "$677" },
  "Libya": { population: "6,888,388", landArea: "1,759,540 km²", gdpPerCapita: "$6,357" },
  "Liechtenstein": { population: "39,327", landArea: "160 km²", gdpPerCapita: "$184,083" },
  "Lithuania": { population: "2,718,352", landArea: "65,300 km²", gdpPerCapita: "$24,169" },
  "Luxembourg": { population: "654,768", landArea: "2,586 km²", gdpPerCapita: "$126,426" },
  "Madagascar": { population: "30,325,732", landArea: "587,041 km²", gdpPerCapita: "$515" },
  "Malawi": { population: "20,931,751", landArea: "118,484 km²", gdpPerCapita: "$636" },
  "Malaysia": { population: "34,308,525", landArea: "330,803 km²", gdpPerCapita: "$12,193" },
  "Maldives": { population: "523,787", landArea: "298 km²", gdpPerCapita: "$11,818" },
  "Mali": { population: "23,293,698", landArea: "1,240,192 km²", gdpPerCapita: "$893" },
  "Malta": { population: "535,064", landArea: "316 km²", gdpPerCapita: "$35,513" },
  "Marshall Islands": { population: "41,569", landArea: "181 km²", gdpPerCapita: "$4,929" },
  "Mauritania": { population: "4,862,989", landArea: "1,030,700 km²", gdpPerCapita: "$1,673" },
  "Mauritius": { population: "1,300,557", landArea: "2,040 km²", gdpPerCapita: "$10,217" },
  "Mexico": { population: "128,455,567", landArea: "1,964,375 km²", gdpPerCapita: "$10,045" },
  "Micronesia": { population: "114,164", landArea: "702 km²", gdpPerCapita: "$3,568" },
  "Moldova": { population: "2,512,758", landArea: "33,846 km²", gdpPerCapita: "$5,608" },
  "Monaco": { population: "36,469", landArea: "2.02 km²", gdpPerCapita: "$234,317" },
  "Mongolia": { population: "3,447,157", landArea: "1,564,110 km²", gdpPerCapita: "$4,670" },
  "Montenegro": { population: "626,485", landArea: "13,812 km²", gdpPerCapita: "$10,361" },
  "Morocco": { population: "37,840,044", landArea: "446,550 km²", gdpPerCapita: "$3,795" },
  "Mozambique": { population: "33,897,354", landArea: "801,590 km²", gdpPerCapita: "$507" },
  "Myanmar": { population: "54,577,997", landArea: "676,578 km²", gdpPerCapita: "$1,207" },
  "Namibia": { population: "2,604,172", landArea: "825,615 km²", gdpPerCapita: "$4,729" },
  "Nauru": { population: "12,668", landArea: "21 km²", gdpPerCapita: "$12,255" },
  "Nepal": { population: "30,547,580", landArea: "147,181 km²", gdpPerCapita: "$1,336" },
  "Netherlands": { population: "17,618,299", landArea: "41,850 km²", gdpPerCapita: "$57,534" },
  "New Zealand": { population: "5,228,100", landArea: "270,467 km²", gdpPerCapita: "$48,781" },
  "Nicaragua": { population: "7,046,310", landArea: "130,373 km²", gdpPerCapita: "$2,028" },
  "Niger": { population: "27,202,843", landArea: "1,267,000 km²", gdpPerCapita: "$590" },
  "Nigeria": { population: "223,804,632", landArea: "923,768 km²", gdpPerCapita: "$2,184" },
  "North Macedonia": { population: "2,085,051", landArea: "25,713 km²", gdpPerCapita: "$7,027" },
  "Norway": { population: "5,474,360", landArea: "323,802 km²", gdpPerCapita: "$106,149" },
  "Oman": { population: "4,576,298", landArea: "309,500 km²", gdpPerCapita: "$19,302" },
  "Pakistan": { population: "240,485,658", landArea: "881,912 km²", gdpPerCapita: "$1,568" },
  "Palau": { population: "18,055", landArea: "459 km²", gdpPerCapita: "$17,488" },
  "Panama": { population: "4,468,087", landArea: "75,417 km²", gdpPerCapita: "$16,192" },
  "Papua New Guinea": { population: "10,329,931", landArea: "462,840 km²", gdpPerCapita: "$2,804" },
  "Paraguay": { population: "6,861,524", landArea: "406,752 km²", gdpPerCapita: "$5,415" },
  "Peru": { population: "34,352,719", landArea: "1,285,216 km²", gdpPerCapita: "$6,692" },
  "Philippines": { population: "117,337,368", landArea: "300,000 km²", gdpPerCapita: "$3,905" },
  "Poland": { population: "41,026,067", landArea: "312,696 km²", gdpPerCapita: "$19,974" },
  "Portugal": { population: "10,247,605", landArea: "92,090 km²", gdpPerCapita: "$26,266" },
  "Qatar": { population: "2,716,391", landArea: "11,586 km²", gdpPerCapita: "$66,838" },
  "Romania": { population: "19,892,812", landArea: "238,397 km²", gdpPerCapita: "$15,892" },
  "Russia": { population: "144,444,359", landArea: "17,098,242 km²", gdpPerCapita: "$12,194" },
  "Rwanda": { population: "14,094,683", landArea: "26,338 km²", gdpPerCapita: "$966" },
  "Saint Kitts and Nevis": { population: "47,755", landArea: "261 km²", gdpPerCapita: "$20,038" },
  "Saint Lucia": { population: "180,251", landArea: "616 km²", gdpPerCapita: "$12,951" },
  "Samoa": { population: "225,681", landArea: "2,842 km²", gdpPerCapita: "$4,349" },
  "San Marino": { population: "33,642", landArea: "61 km²", gdpPerCapita: "$59,466" },
  "Sao Tome and Principe": { population: "231,856", landArea: "964 km²", gdpPerCapita: "$2,209" },
  "Saudi Arabia": { population: "36,947,025", landArea: "2,149,690 km²", gdpPerCapita: "$30,447" },
  "Senegal": { population: "17,763,163", landArea: "196,722 km²", gdpPerCapita: "$1,607" },
  "Serbia": { population: "6,693,375", landArea: "88,361 km²", gdpPerCapita: "$10,622" },
  "Seychelles": { population: "107,660", landArea: "452 km²", gdpPerCapita: "$17,903" },
  "Sierra Leone": { population: "8,791,092", landArea: "71,740 km²", gdpPerCapita: "$527" },
  "Singapore": { population: "6,014,723", landArea: "716 km²", gdpPerCapita: "$72,794" },
  "Slovakia": { population: "5,795,199", landArea: "49,037 km²", gdpPerCapita: "$22,070" },
  "Slovenia": { population: "2,119,675", landArea: "20,273 km²", gdpPerCapita: "$30,457" },
  "Solomon Islands": { population: "740,424", landArea: "28,896 km²", gdpPerCapita: "$2,405" },
  "Somalia": { population: "18,143,378", landArea: "637,657 km²", gdpPerCapita: "$461" },
  "South Africa": { population: "60,414,495", landArea: "1,221,037 km²", gdpPerCapita: "$6,994" },
  "South Korea": { population: "51,784,059", landArea: "100,210 km²", gdpPerCapita: "$34,758" },
  "South Sudan": { population: "11,088,796", landArea: "644,329 km²", gdpPerCapita: "$455" },
  "Spain": { population: "47,519,628", landArea: "505,992 km²", gdpPerCapita: "$30,116" },
  "Sri Lanka": { population: "21,893,579", landArea: "65,610 km²", gdpPerCapita: "$3,474" },
  "St. Vincent Grenadines": { population: "103,698", landArea: "389 km²", gdpPerCapita: "$8,818" },
  "State of Palestine": { population: "5,495,584", landArea: "6,020 km²", gdpPerCapita: "$3,664" },
  "Sudan": { population: "48,109,006", landArea: "1,886,068 km²", gdpPerCapita: "$752" },
  "Suriname": { population: "623,236", landArea: "163,820 km²", gdpPerCapita: "$6,106" },
  "Sweden": { population: "10,612,086", landArea: "450,295 km²", gdpPerCapita: "$60,239" },
  "Switzerland": { population: "8,796,669", landArea: "41,284 km²", gdpPerCapita: "$91,991" },
  "Syria": { population: "23,227,014", landArea: "185,180 km²", gdpPerCapita: "$537" },
  "Tajikistan": { population: "10,143,543", landArea: "143,100 km²", gdpPerCapita: "$1,034" },
  "Tanzania": { population: "67,438,106", landArea: "945,087 km²", gdpPerCapita: "$1,192" },
  "Thailand": { population: "71,801,279", landArea: "513,120 km²", gdpPerCapita: "$7,808" },
  "Timor-Leste": { population: "1,360,596", landArea: "14,874 km²", gdpPerCapita: "$1,456" },
  "Togo": { population: "9,053,799", landArea: "56,785 km²", gdpPerCapita: "$1,016" },
  "Tonga": { population: "107,773", landArea: "747 km²", gdpPerCapita: "$5,425" },
  "Trinidad and Tobago": { population: "1,534,937", landArea: "5,130 km²", gdpPerCapita: "$17,640" },
  "Tunisia": { population: "12,458,223", landArea: "163,610 km²", gdpPerCapita: "$3,807" },
  "Turkey": { population: "85,816,199", landArea: "783,562 km²", gdpPerCapita: "$10,655" },
  "Turkmenistan": { population: "6,516,100", landArea: "488,100 km²", gdpPerCapita: "$8,128" },
  "Tuvalu": { population: "11,396", landArea: "26 km²", gdpPerCapita: "$4,970" },
  "U.A.E.": { population: "9,516,871", landArea: "83,600 km²", gdpPerCapita: "$48,950" },
  "U.K.": { population: "67,736,802", landArea: "242,495 km²", gdpPerCapita: "$46,510" },
  "U.S.": { population: "339,996,563", landArea: "9,833,517 km²", gdpPerCapita: "$76,399" },
  "Uganda": { population: "48,582,334", landArea: "241,550 km²", gdpPerCapita: "$964" },
  "Ukraine": { population: "36,744,634", landArea: "603,500 km²", gdpPerCapita: "$4,836" },
  "Uruguay": { population: "3,423,108", landArea: "176,215 km²", gdpPerCapita: "$17,278" },
  "Uzbekistan": { population: "35,163,944", landArea: "447,400 km²", gdpPerCapita: "$2,255" },
  "Vanuatu": { population: "334,506", landArea: "12,189 km²", gdpPerCapita: "$3,105" },
  "Venezuela": { population: "28,838,499", landArea: "916,445 km²", gdpPerCapita: "$3,946" },
  "Vietnam": { population: "98,858,950", landArea: "331,212 km²", gdpPerCapita: "$4,164" },
  "Yemen": { population: "34,449,825", landArea: "527,968 km²", gdpPerCapita: "$617" },
  "Zambia": { population: "20,569,737", landArea: "752,612 km²", gdpPerCapita: "$1,291" },
  "Zimbabwe": { population: "16,665,409", landArea: "390,757 km²", gdpPerCapita: "$1,464" }
};

// Main function to enrich metadata
async function main() {
  const metadataPath = path.join(__dirname, '..', 'public', 'images', 'countries', 'metadata.json');
  
  try {
    console.log('Reading existing metadata...');
    const existingData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log('Enriching metadata with comprehensive country data...');
    const enrichedData = existingData.map((country) => {
      const info = countryData[country.name] || {};
      const stats = statsData[country.name] || {};
      
      return {
        name: country.name,
        fileName: country.fileName,
        url: country.url,
        fullName: info.fullName || country.name,
        continent: info.continent || 'Unknown',
        region: info.region || 'Unknown',
        capital: info.capital || 'Unknown',
        currency: info.currency || 'Unknown',
        population: stats.population || 'N/A',
        landArea: stats.landArea || 'N/A',
        gdpPerCapita: stats.gdpPerCapita || 'N/A'
      };
    });
    
    // Save enriched metadata
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(enrichedData, null, 2)
    );
    
    console.log('✅ Metadata successfully enriched!');
    console.log(`📊 Updated ${enrichedData.length} countries with comprehensive data`);
    console.log('📝 Added fields: continent, region, capital, currency, population, landArea, gdpPerCapita');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
