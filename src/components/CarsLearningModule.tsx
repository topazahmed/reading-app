import React, { useState, useEffect } from "react";
import "./CarsLearningModule.scss";

interface Car {
  name: string;
  logo: string;
}

// Using car brand logos from a reliable CDN or local folder
const cars: Car[] = [
  { name: "Toyota", logo: "https://cdn.brandfetch.io/toyota.com/w/400/h/400" },
  { name: "Honda", logo: "https://cdn.brandfetch.io/honda.com/w/400/h/400" },
  { name: "Ford", logo: "https://cdn.brandfetch.io/ford.com/w/400/h/400" },
  { name: "Chevrolet", logo: "https://cdn.brandfetch.io/chevrolet.com/w/400/h/400" },
  { name: "BMW", logo: "https://cdn.brandfetch.io/bmw.com/w/400/h/400" },
  { name: "Mercedes-Benz", logo: "https://cdn.brandfetch.io/mercedes-benz.com/w/400/h/400" },
  { name: "Audi", logo: "https://cdn.brandfetch.io/audi.com/w/400/h/400" },
  { name: "Volkswagen", logo: "https://cdn.brandfetch.io/vw.com/w/400/h/400" },
  { name: "Tesla", logo: "https://cdn.brandfetch.io/tesla.com/w/400/h/400" },
  { name: "Nissan", logo: "https://cdn.brandfetch.io/nissan.com/w/400/h/400" },
  { name: "Mazda", logo: "https://cdn.brandfetch.io/mazda.com/w/400/h/400" },
  { name: "Hyundai", logo: "https://cdn.brandfetch.io/hyundai.com/w/400/h/400" },
  { name: "Kia", logo: "https://cdn.brandfetch.io/kia.com/w/400/h/400" },
  { name: "Subaru", logo: "https://cdn.brandfetch.io/subaru.com/w/400/h/400" },
  { name: "Jeep", logo: "https://cdn.brandfetch.io/jeep.com/w/400/h/400" },
  { name: "Porsche", logo: "https://cdn.brandfetch.io/porsche.com/w/400/h/400" },
  { name: "Ferrari", logo: "https://cdn.brandfetch.io/ferrari.com/w/400/h/400" },
  { name: "Lamborghini", logo: "https://cdn.brandfetch.io/lamborghini.com/w/400/h/400" },
  { name: "Lexus", logo: "https://cdn.brandfetch.io/lexus.com/w/400/h/400" },
  { name: "Volvo", logo: "https://cdn.brandfetch.io/volvo.com/w/400/h/400" },
];

const CarsLearningModule: React.FC = () => {
  const [currentCar, setCurrentCar] = useState<Car>(cars[0]);
  const [playingLetter, setPlayingLetter] = useState<number | null>(null);

  const getRandomCar = () => {
    const randomIndex = Math.floor(Math.random() * cars.length);
    setCurrentCar(cars[randomIndex]);
    setPlayingLetter(null);
  };

  const speakLetter = (letter: string, index: number) => {
    if ('speechSynthesis' in window) {
      setPlayingLetter(index);
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        setPlayingLetter(null);
      };
    }
  };

  const speakCarName = (name: string) => {
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
          getRandomCar();
        }, 2000);
      };
    }
  };

  // Initialize with a random car on mount
  useEffect(() => {
    getRandomCar();
  }, []);

  return (
    <div className="cars-learning-module">
      <div className="cars-content">
        <div className="car-card">
          <div className="car-logo-container">
            <img 
              src={currentCar.logo} 
              alt={`${currentCar.name} logo`}
              className="car-logo"
              onError={(e) => {
                // Fallback to a colored placeholder if CDN fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; font-size: 2rem; font-weight: bold; text-align: center; padding: 20px;">${currentCar.name}</div>`;
                }
              }}
            />
          </div>

          <div className="letters-container">
            {currentCar.name.split('').map((letter, index) => (
              <button
                key={index}
                className={`letter-button ${playingLetter === index ? 'playing' : ''}`}
                onClick={() => speakLetter(letter, index)}
              >
                {letter}
              </button>
            ))}
          </div>

          <button 
            className="car-name-button"
            onClick={() => speakCarName(currentCar.name)}
          >
            {currentCar.name}
          </button>
        </div>
      </div>

      <div className="new-car-section">
        <button
          className="new-car-button"
          onClick={getRandomCar}
        >
          🔄 Show New Car! 🚗
        </button>
      </div>
    </div>
  );
};

export default CarsLearningModule;
