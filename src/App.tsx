import React, { useState, useEffect } from 'react';
import './App.css';
import LengthSelector from './components/LengthSelector';
import WordGrid from './components/WordGrid';
import { wordsByLength, getRandomWords } from './data/words';
import { speakWord, speakLetter, isAudioSupported } from './utils/audio';

function App() {
  const [selectedLength, setSelectedLength] = useState<number>(4);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string>('');
  const [audioSupported, setAudioSupported] = useState<boolean>(true);

  const availableLengths = Object.keys(wordsByLength).map(Number).sort((a, b) => a - b);

  useEffect(() => {
    setAudioSupported(isAudioSupported());
    
    // Load voices when they become available
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      // Load immediately if voices are already available
      loadVoices();
      
      // Listen for voices loaded event
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  useEffect(() => {
    const words = getRandomWords(selectedLength, 10);
    setCurrentWords(words);
  }, [selectedLength]);

  const handleLengthChange = (length: number) => {
    setSelectedLength(length);
    setCurrentPlayingWord('');
    // Generate new random words when length changes
    const words = getRandomWords(length, 10);
    setCurrentWords(words);
  };

  const handleWordSpeak = (word: string) => {
    if (!audioSupported) {
      alert('Audio is not supported in your browser');
      return;
    }

    setCurrentPlayingWord(word);
    speakWord(word);
    
    // Reset playing state after a delay
    setTimeout(() => {
      setCurrentPlayingWord('');
    }, 1500);
  };

  const handleLetterSpeak = (letter: string) => {
    if (!audioSupported) {
      alert('Audio is not supported in your browser');
      return;
    }

    speakLetter(letter);
  };

  const handleGetNewWords = () => {
    const words = getRandomWords(selectedLength, 10);
    setCurrentWords(words);
    setCurrentPlayingWord('');
  };

  return (
    <div className="App">
      <div className="app-title">
        <h1>Mr. Pintu Pant</h1>
        <h1>Learning words</h1>
      </div>

      <main className="App-main">
        {!audioSupported && (
          <div className="audio-warning">
            ⚠️ Audio is not supported in your browser. Please use a modern browser for the best experience.
          </div>
        )}

        <LengthSelector
          selectedLength={selectedLength}
          onLengthChange={handleLengthChange}
          availableLengths={availableLengths}
        />

        <WordGrid
          words={currentWords}
          onWordSpeak={handleWordSpeak}
          onLetterSpeak={handleLetterSpeak}
          currentPlayingWord={currentPlayingWord}
        />

        <div className="new-words-section">
          <button className="new-words-button" onClick={handleGetNewWords}>
            🔄 Get New Words! 🎉
          </button>
        </div>
      </main>

      <footer className="App-footer">
        <p>🎉 Click on words to hear them and learn new ones! Keep practicing, Mr. Pintu Pant! �</p>
      </footer>
    </div>
  );
}

export default App;
