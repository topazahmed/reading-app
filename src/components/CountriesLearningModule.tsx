import React, { useState, useEffect, useCallback } from "react";
import "./CountriesLearningModule.scss";

interface CountryMetadata {
  name: string;
  fileName: string;
  url: string;
  fullName: string;
  continent: string;
  region: string;
  capital: string;
  currency: string;
  population: string;
  landArea: string;
  gdpPerCapita: string;
}

interface Country {
  name: string;
  image: string;
  metadata?: CountryMetadata;
}

// Base country data without metadata
const baseCountries = [
  { name: "Afghanistan", image: "/images/countries/Afghanistan.gif" },
  { name: "Albania", image: "/images/countries/Albania.gif" },
  { name: "Algeria", image: "/images/countries/Algeria.gif" },
  { name: "Andorra", image: "/images/countries/Andorra.gif" },
  { name: "Angola", image: "/images/countries/Angola.gif" },
  { name: "Antigua and Barbuda", image: "/images/countries/Antigua-and-Barbuda.gif" },
  { name: "Argentina", image: "/images/countries/Argentina.gif" },
  { name: "Armenia", image: "/images/countries/Armenia.gif" },
  { name: "Australia", image: "/images/countries/Australia.gif" },
  { name: "Austria", image: "/images/countries/Austria.gif" },
  { name: "Azerbaijan", image: "/images/countries/Azerbaijan.gif" },
  { name: "Bahamas", image: "/images/countries/Bahamas.gif" },
  { name: "Bahrain", image: "/images/countries/Bahrain.gif" },
  { name: "Bangladesh", image: "/images/countries/Bangladesh.gif" },
  { name: "Barbados", image: "/images/countries/Barbados.gif" },
  { name: "Belarus", image: "/images/countries/Belarus.gif" },
  { name: "Belgium", image: "/images/countries/Belgium.gif" },
  { name: "Belize", image: "/images/countries/Belize.gif" },
  { name: "Benin", image: "/images/countries/Benin.gif" },
  { name: "Bhutan", image: "/images/countries/Bhutan.gif" },
  { name: "Bolivia", image: "/images/countries/Bolivia.gif" },
  { name: "Bosnia and Herzegovina", image: "/images/countries/Bosnia-and-Herzegovina.gif" },
  { name: "Botswana", image: "/images/countries/Botswana.gif" },
  { name: "Brazil", image: "/images/countries/Brazil.gif" },
  { name: "Brunei", image: "/images/countries/Brunei.gif" },
  { name: "Bulgaria", image: "/images/countries/Bulgaria.gif" },
  { name: "Burkina Faso", image: "/images/countries/Burkina-Faso.gif" },
  { name: "Burundi", image: "/images/countries/Burundi.gif" },
  { name: "Cabo Verde", image: "/images/countries/Cabo-Verde.gif" },
  { name: "Cambodia", image: "/images/countries/Cambodia.gif" },
  { name: "Cameroon", image: "/images/countries/Cameroon.gif" },
  { name: "Canada", image: "/images/countries/Canada.gif" },
  { name: "CAR", image: "/images/countries/CAR.gif" },
  { name: "Chad", image: "/images/countries/Chad.gif" },
  { name: "Chile", image: "/images/countries/Chile.gif" },
  { name: "China", image: "/images/countries/China.gif" },
  { name: "Colombia", image: "/images/countries/Colombia.gif" },
  { name: "Comoros", image: "/images/countries/Comoros.gif" },
  { name: "Congo", image: "/images/countries/Congo.jpg" },
  { name: "Costa Rica", image: "/images/countries/Costa-Rica.gif" },
  { name: "Croatia", image: "/images/countries/Croatia.gif" },
  { name: "Cuba", image: "/images/countries/Cuba.gif" },
  { name: "Cyprus", image: "/images/countries/Cyprus.gif" },
  { name: "Czechia", image: "/images/countries/Czechia.gif" },
  { name: "Denmark", image: "/images/countries/Denmark.gif" },
  { name: "Djibouti", image: "/images/countries/Djibouti.gif" },
  { name: "Dominica", image: "/images/countries/Dominica.gif" },
  { name: "Dominican Republic", image: "/images/countries/Dominican-Republic.gif" },
  { name: "Ecuador", image: "/images/countries/Ecuador.gif" },
  { name: "Egypt", image: "/images/countries/Egypt.gif" },
  { name: "El Salvador", image: "/images/countries/El-Salvador.gif" },
  { name: "Equatorial Guinea", image: "/images/countries/Equatorial-Guinea.gif" },
  { name: "Eritrea", image: "/images/countries/Eritrea.gif" },
  { name: "Estonia", image: "/images/countries/Estonia.gif" },
  { name: "Eswatini", image: "/images/countries/Eswatini.gif" },
  { name: "Ethiopia", image: "/images/countries/Ethiopia.gif" },
  { name: "Fiji", image: "/images/countries/Fiji.gif" },
  { name: "Finland", image: "/images/countries/Finland.gif" },
  { name: "France", image: "/images/countries/France.gif" },
  { name: "Gabon", image: "/images/countries/Gabon.gif" },
  { name: "Gambia", image: "/images/countries/Gambia.gif" },
  { name: "Georgia", image: "/images/countries/Georgia.gif" },
  { name: "Germany", image: "/images/countries/Germany.gif" },
  { name: "Ghana", image: "/images/countries/Ghana.gif" },
  { name: "Greece", image: "/images/countries/Greece.gif" },
  { name: "Grenada", image: "/images/countries/Grenada.gif" },
  { name: "Guatemala", image: "/images/countries/Guatemala.gif" },
  { name: "Guinea", image: "/images/countries/Guinea.gif" },
  { name: "Guinea-Bissau", image: "/images/countries/Guinea-Bissau.gif" },
  { name: "Guyana", image: "/images/countries/Guyana.gif" },
  { name: "Haiti", image: "/images/countries/Haiti.gif" },
  { name: "Holy See", image: "/images/countries/Holy-See.gif" },
  { name: "Honduras", image: "/images/countries/Honduras.gif" },
  { name: "Hungary", image: "/images/countries/Hungary.gif" },
  { name: "Iceland", image: "/images/countries/Iceland.gif" },
  { name: "India", image: "/images/countries/India.gif" },
  { name: "Indonesia", image: "/images/countries/Indonesia.gif" },
  { name: "Iran", image: "/images/countries/Iran.gif" },
  { name: "Iraq", image: "/images/countries/Iraq.gif" },
  { name: "Ireland", image: "/images/countries/Ireland.gif" },
  { name: "Israel", image: "/images/countries/Israel.gif" },
  { name: "Italy", image: "/images/countries/Italy.gif" },
  { name: "Jamaica", image: "/images/countries/Jamaica.gif" },
  { name: "Japan", image: "/images/countries/Japan.gif" },
  { name: "Jordan", image: "/images/countries/Jordan.gif" },
  { name: "Kazakhstan", image: "/images/countries/Kazakhstan.gif" },
  { name: "Kenya", image: "/images/countries/Kenya.gif" },
  { name: "Kiribati", image: "/images/countries/Kiribati.gif" },
  { name: "Kuwait", image: "/images/countries/Kuwait.gif" },
  { name: "Kyrgyzstan", image: "/images/countries/Kyrgyzstan.gif" },
  { name: "Laos", image: "/images/countries/Laos.gif" },
  { name: "Latvia", image: "/images/countries/Latvia.gif" },
  { name: "Lebanon", image: "/images/countries/Lebanon.gif" },
  { name: "Lesotho", image: "/images/countries/Lesotho.gif" },
  { name: "Liberia", image: "/images/countries/Liberia.gif" },
  { name: "Libya", image: "/images/countries/Libya.gif" },
  { name: "Liechtenstein", image: "/images/countries/Liechtenstein.gif" },
  { name: "Lithuania", image: "/images/countries/Lithuania.gif" },
  { name: "Luxembourg", image: "/images/countries/Luxembourg.gif" },
  { name: "Madagascar", image: "/images/countries/Madagascar.gif" },
  { name: "Malawi", image: "/images/countries/Malawi.gif" },
  { name: "Malaysia", image: "/images/countries/Malaysia.gif" },
  { name: "Maldives", image: "/images/countries/Maldives.gif" },
  { name: "Mali", image: "/images/countries/Mali.gif" },
  { name: "Malta", image: "/images/countries/Malta.gif" },
  { name: "Marshall Islands", image: "/images/countries/Marshall-Islands.gif" },
  { name: "Mauritania", image: "/images/countries/Mauritania.gif" },
  { name: "Mauritius", image: "/images/countries/Mauritius.gif" },
  { name: "Mexico", image: "/images/countries/Mexico.gif" },
  { name: "Micronesia", image: "/images/countries/Micronesia.gif" },
  { name: "Moldova", image: "/images/countries/Moldova.gif" },
  { name: "Monaco", image: "/images/countries/Monaco.gif" },
  { name: "Mongolia", image: "/images/countries/Mongolia.gif" },
  { name: "Montenegro", image: "/images/countries/Montenegro.gif" },
  { name: "Morocco", image: "/images/countries/Morocco.gif" },
  { name: "Mozambique", image: "/images/countries/Mozambique.gif" },
  { name: "Myanmar", image: "/images/countries/Myanmar.gif" },
  { name: "Namibia", image: "/images/countries/Namibia.gif" },
  { name: "Nauru", image: "/images/countries/Nauru.gif" },
  { name: "Nepal", image: "/images/countries/Nepal.gif" },
  { name: "Netherlands", image: "/images/countries/Netherlands.gif" },
  { name: "New Zealand", image: "/images/countries/New-Zealand.gif" },
  { name: "Nicaragua", image: "/images/countries/Nicaragua.gif" },
  { name: "Niger", image: "/images/countries/Niger.gif" },
  { name: "Nigeria", image: "/images/countries/Nigeria.gif" },
  { name: "North Macedonia", image: "/images/countries/North-Macedonia.gif" },
  { name: "Norway", image: "/images/countries/Norway.gif" },
  { name: "Oman", image: "/images/countries/Oman.gif" },
  { name: "Pakistan", image: "/images/countries/Pakistan.gif" },
  { name: "Palau", image: "/images/countries/Palau.gif" },
  { name: "Panama", image: "/images/countries/Panama.gif" },
  { name: "Papua New Guinea", image: "/images/countries/Papua-New-Guinea.gif" },
  { name: "Paraguay", image: "/images/countries/Paraguay.gif" },
  { name: "Peru", image: "/images/countries/Peru.gif" },
  { name: "Philippines", image: "/images/countries/Philippines.gif" },
  { name: "Poland", image: "/images/countries/Poland.gif" },
  { name: "Portugal", image: "/images/countries/Portugal.gif" },
  { name: "Qatar", image: "/images/countries/Qatar.gif" },
  { name: "Romania", image: "/images/countries/Romania.gif" },
  { name: "Russia", image: "/images/countries/Russia.gif" },
  { name: "Rwanda", image: "/images/countries/Rwanda.gif" },
  { name: "Saint Kitts and Nevis", image: "/images/countries/Saint-Kitts-and-Nevis.gif" },
  { name: "Saint Lucia", image: "/images/countries/Saint-Lucia.gif" },
  { name: "Samoa", image: "/images/countries/Samoa.gif" },
  { name: "San Marino", image: "/images/countries/San-Marino.gif" },
  { name: "Sao Tome and Principe", image: "/images/countries/Sao-Tome-and-Principe.gif" },
  { name: "Saudi Arabia", image: "/images/countries/Saudi-Arabia.gif" },
  { name: "Senegal", image: "/images/countries/Senegal.gif" },
  { name: "Serbia", image: "/images/countries/Serbia.gif" },
  { name: "Seychelles", image: "/images/countries/Seychelles.gif" },
  { name: "Sierra Leone", image: "/images/countries/Sierra-Leone.gif" },
  { name: "Singapore", image: "/images/countries/Singapore.gif" },
  { name: "Slovakia", image: "/images/countries/Slovakia.gif" },
  { name: "Slovenia", image: "/images/countries/Slovenia.gif" },
  { name: "Solomon Islands", image: "/images/countries/Solomon-Islands.gif" },
  { name: "Somalia", image: "/images/countries/Somalia.gif" },
  { name: "South Africa", image: "/images/countries/South-Africa.gif" },
  { name: "South Korea", image: "/images/countries/South-Korea.gif" },
  { name: "South Sudan", image: "/images/countries/South-Sudan.gif" },
  { name: "Spain", image: "/images/countries/Spain.gif" },
  { name: "Sri Lanka", image: "/images/countries/Sri-Lanka.gif" },
  { name: "St. Vincent Grenadines", image: "/images/countries/St.-Vincent-Grenadines.gif" },
  { name: "State of Palestine", image: "/images/countries/State-of-Palestine.gif" },
  { name: "Sudan", image: "/images/countries/Sudan.gif" },
  { name: "Suriname", image: "/images/countries/Suriname.gif" },
  { name: "Sweden", image: "/images/countries/Sweden.gif" },
  { name: "Switzerland", image: "/images/countries/Switzerland.gif" },
  { name: "Syria", image: "/images/countries/Syria.png" },
  { name: "Tajikistan", image: "/images/countries/Tajikistan.gif" },
  { name: "Tanzania", image: "/images/countries/Tanzania.gif" },
  { name: "Thailand", image: "/images/countries/Thailand.gif" },
  { name: "Timor-Leste", image: "/images/countries/Timor-Leste.gif" },
  { name: "Togo", image: "/images/countries/Togo.gif" },
  { name: "Tonga", image: "/images/countries/Tonga.gif" },
  { name: "Trinidad and Tobago", image: "/images/countries/Trinidad-and-Tobago.gif" },
  { name: "Tunisia", image: "/images/countries/Tunisia.gif" },
  { name: "Turkey", image: "/images/countries/Turkey.gif" },
  { name: "Turkmenistan", image: "/images/countries/Turkmenistan.gif" },
  { name: "Tuvalu", image: "/images/countries/Tuvalu.gif" },
  { name: "U.A.E.", image: "/images/countries/U.A.E..gif" },
  { name: "U.K.", image: "/images/countries/U.K..gif" },
  { name: "U.S.", image: "/images/countries/U.S..gif" },
  { name: "Uganda", image: "/images/countries/Uganda.gif" },
  { name: "Ukraine", image: "/images/countries/Ukraine.png" },
  { name: "Uruguay", image: "/images/countries/Uruguay.gif" },
  { name: "Uzbekistan", image: "/images/countries/Uzbekistan.gif" },
  { name: "Vanuatu", image: "/images/countries/Vanuatu.gif" },
  { name: "Venezuela", image: "/images/countries/Venezuela.gif" },
  { name: "Vietnam", image: "/images/countries/Vietnam.gif" },
  { name: "Yemen", image: "/images/countries/Yemen.gif" },
  { name: "Zambia", image: "/images/countries/Zambia.gif" },
  { name: "Zimbabwe", image: "/images/countries/Zimbabwe.gif" },
];

const CountriesLearningModule: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>(baseCountries);
  const [currentCountry, setCurrentCountry] = useState<Country>(baseCountries[0]);

  // Load metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/images/countries/metadata.json');
        const metadata: CountryMetadata[] = await response.json();
        const metadataMap = new Map(metadata.map(m => [m.name, m]));
        
        // Enrich countries with metadata
        const enrichedCountries = baseCountries.map(country => ({
          ...country,
          metadata: metadataMap.get(country.name)
        }));
        
        setCountries(enrichedCountries);
        // Pick random country from enriched list
        const randomIndex = Math.floor(Math.random() * enrichedCountries.length);
        setCurrentCountry(enrichedCountries[randomIndex]);
      } catch (error) {
        console.error('Failed to load metadata:', error);
      }
    };
    
    loadMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRandomCountry = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    setCurrentCountry(countries[randomIndex]);
  }, [countries]);

  const speakCountryName = (name: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      
      // Auto-refresh after 2 seconds
      utterance.onend = () => {
        setTimeout(() => {
          getRandomCountry();
        }, 2000);
      };
    }
  };

  // Initialize with a random country when countries list changes
  useEffect(() => {
    if (countries.length > 0 && countries !== baseCountries) {
      getRandomCountry();
    }
  }, [countries, getRandomCountry]);

  return (
    <div className="countries-learning-module">
      <div className="countries-content">
        <div className="country-card">
          <div className="country-flag-container">
            <img 
              src={currentCountry.image} 
              alt={`${currentCountry.name} flag`}
              className="country-flag"
              onError={(e) => {
                // Fallback to a colored placeholder if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; font-size: 1.5rem; font-weight: bold; text-align: center; padding: 20px;">${currentCountry.name}</div>`;
                }
              }}
            />
          </div>

          {currentCountry.metadata && (
            <div className="country-info">
              <div className="country-info-row">
                <span className="info-label">🌍 Continent:</span>
                <span className="info-value">{currentCountry.metadata.continent}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">📍 Region:</span>
                <span className="info-value">{currentCountry.metadata.region}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">🏛️ Capital:</span>
                <span className="info-value">{currentCountry.metadata.capital}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">👥 Population:</span>
                <span className="info-value">{currentCountry.metadata.population}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">📏 Land Area:</span>
                <span className="info-value">{currentCountry.metadata.landArea}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">💰 GDP per Capita:</span>
                <span className="info-value">{currentCountry.metadata.gdpPerCapita}</span>
              </div>
              <div className="country-info-row">
                <span className="info-label">💵 Currency:</span>
                <span className="info-value">{currentCountry.metadata.currency}</span>
              </div>
            </div>
          )}

          <button 
            className="country-name-button"
            onClick={() => speakCountryName(currentCountry.name)}
          >
            {currentCountry.name}
          </button>
        </div>
      </div>

      <div className="new-country-section">
        <button
          className="new-country-button"
          onClick={getRandomCountry}
        >
          🔄 Show New Country! 🌍
        </button>
      </div>
    </div>
  );
};

export default CountriesLearningModule;
