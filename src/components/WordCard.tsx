import React from 'react';
import './WordCard.css';

interface WordCardProps {
  word: string;
  onSpeak: (word: string) => void;
  onSpeakLetter: (letter: string) => void;
  isPlaying?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, onSpeak, onSpeakLetter, isPlaying = false }) => {
  const handleWordClick = () => {
    onSpeak(word);
  };

  const handleLetterClick = (letter: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSpeakLetter(letter);
  };

  return (
    <div 
      className={`word-card ${isPlaying ? 'playing' : ''}`}
      style={{ '--letter-count': word.length } as React.CSSProperties}
      role="region"
      aria-label={`Word: ${word}`}
    >
      <div className="letters-container">
        {word.split('').map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            className="letter-button"
            onClick={(e) => handleLetterClick(letter, e)}
            aria-label={`Letter ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <button 
        className="word-speak-button"
        onClick={handleWordClick}
        aria-label={`Speak whole word: ${word}`}
      >
        <span className="speaker-icon">🔊</span>
        <span className="speak-text">Say "{word}"</span>
      </button>
    </div>
  );
};

export default WordCard;