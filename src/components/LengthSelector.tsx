import React from 'react';
import './LengthSelector.css';

interface LengthSelectorProps {
  selectedLength: number;
  onLengthChange: (length: number) => void;
  availableLengths: number[];
}

const LengthSelector: React.FC<LengthSelectorProps> = ({
  selectedLength,
  onLengthChange,
  availableLengths
}) => {
  return (
    <div className="length-selector">
      <h3 className="selector-title">🌈 Choose your word size! 📏</h3>
      <div className="length-buttons">
        {availableLengths.map((length) => (
          <button
            key={length}
            className={`length-button ${selectedLength === length ? 'active' : ''}`}
            onClick={() => onLengthChange(length)}
          >
            {length}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LengthSelector;