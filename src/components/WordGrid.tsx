import React from 'react';
import WordCard from './WordCard';
import './WordGrid.css';

interface WordGridProps {
  words: string[];
  onWordSpeak: (word: string) => void;
  onLetterSpeak: (letter: string) => void;
  currentPlayingWord?: string;
}

const WordGrid: React.FC<WordGridProps> = ({ words, onWordSpeak, onLetterSpeak, currentPlayingWord }) => {
  if (words.length === 0) {
    return (
      <div className="word-grid-empty">
        <p>No words available for this length. Please select a different word length.</p>
      </div>
    );
  }

  return (
    <div className="word-grid">
      <div className="words-container">
        {words.map((word, index) => (
          <WordCard
            key={`${word}-${index}`}
            word={word}
            onSpeak={onWordSpeak}
            onSpeakLetter={onLetterSpeak}
            isPlaying={currentPlayingWord === word}
          />
        ))}
      </div>
    </div>
  );
};

export default WordGrid;