import React, { useState, useEffect } from 'react';
import './App.css';
import LengthSelector from './components/LengthSelector';
import WordGrid from './components/WordGrid';
import MathSelector, { MathDifficulty, MathOperation } from './components/MathSelector';
import MathGrid from './components/MathGrid';
import { wordsByLength, getRandomWords } from './data/words';
import { speakWord, speakLetter, isAudioSupported } from './utils/audio';
import { generateMathProblems, speakNumber, speakMathSolution } from './utils/math';
import { MathProblem } from './components/MathCard';

function App() {
  // Mode state
  const [currentMode, setCurrentMode] = useState<'words' | 'math'>('words');
  
  // Words mode state
  const [selectedLength, setSelectedLength] = useState<number>(4);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string>('');
  
  // Math mode state
  const [mathDifficulty, setMathDifficulty] = useState<MathDifficulty>('easy');
  const [mathOperation, setMathOperation] = useState<MathOperation>('+');
  const [mathProblems, setMathProblems] = useState<MathProblem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  
  // Common state
  const [audioSupported, setAudioSupported] = useState<boolean>(true);

  const availableLengths = Object.keys(wordsByLength).map(Number).sort((a, b) => a - b);

  // Handle URL hash for mode switching
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'math') {
        setCurrentMode('math');
      } else {
        setCurrentMode('words');
      }
    };

    // Set initial mode based on URL hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update URL hash when mode changes
  const handleModeChange = (mode: 'words' | 'math') => {
    console.log('Mode changing to:', mode); // Debug log
    setCurrentMode(mode);
    window.location.hash = mode === 'math' ? 'math' : '';
    
    // Reset state when switching modes
    if (mode === 'words') {
      setCurrentPlayingWord('');
      const words = getRandomWords(selectedLength, 10);
      setCurrentWords(words);
    } else {
      setSolvedProblems(new Set());
      const problems = generateMathProblems(mathDifficulty, mathOperation, 10);
      setMathProblems(problems);
    }
  };

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

  // Generate words when length changes (words mode)
  useEffect(() => {
    if (currentMode === 'words') {
      const words = getRandomWords(selectedLength, 10);
      setCurrentWords(words);
    }
  }, [selectedLength, currentMode]);

  // Generate math problems when difficulty or operation changes (math mode)
  useEffect(() => {
    if (currentMode === 'math') {
      const problems = generateMathProblems(mathDifficulty, mathOperation, 10);
      setMathProblems(problems);
      setSolvedProblems(new Set()); // Reset solved problems
    }
  }, [mathDifficulty, mathOperation, currentMode]);

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

  // Math mode handlers
  const handleMathDifficultyChange = (difficulty: MathDifficulty) => {
    setMathDifficulty(difficulty);
  };

  const handleMathOperationChange = (operation: MathOperation) => {
    setMathOperation(operation);
  };

  const handleNumberSpeak = (number: number) => {
    if (!audioSupported) {
      alert('Audio is not supported in your browser');
      return;
    }

    speakNumber(number);
  };

  const getProblemKey = (problem: MathProblem) => {
    return `${problem.num1}-${problem.operation}-${problem.num2}`;
  };

  const handleMathSolve = (problem: MathProblem) => {
    const problemKey = getProblemKey(problem);
    
    if (solvedProblems.has(problemKey)) {
      // Generate a new problem of the same type
      const newProblems = generateMathProblems(mathDifficulty, mathOperation, 10);
      setMathProblems(newProblems);
      setSolvedProblems(new Set());
    } else {
      // Show solution and speak it
      setSolvedProblems(prev => {
        const newSet = new Set(prev);
        newSet.add(problemKey);
        return newSet;
      });
      
      if (audioSupported) {
        // Delay speaking the solution slightly for better UX
        setTimeout(() => {
          speakMathSolution(problem);
        }, 200);
      }
    }
  };

  const handleGetNewMathProblems = () => {
    const problems = generateMathProblems(mathDifficulty, mathOperation, 10);
    setMathProblems(problems);
    setSolvedProblems(new Set());
  };

  return (
    <div className="App">
      <div className="app-title">
        <h1>Mr. Pintu Pant</h1>
        <div className="learning-mode-header">
          <span className="learning-text">Learning </span>
          <select
            className="mode-dropdown-header"
            value={currentMode}
            onChange={(e) => {
              const newMode = e.target.value as 'words' | 'math';
              console.log('Dropdown changed to:', newMode); // Debug log
              handleModeChange(newMode);
            }}
          >
            <option value="words">words</option>
            <option value="math">math</option>
          </select>
        </div>
      </div>

      <main className="App-main">
        {!audioSupported && (
          <div className="audio-warning">
            ⚠️ Audio is not supported in your browser. Please use a modern browser for the best experience.
          </div>
        )}

        {currentMode === 'words' ? (
          <>
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
          </>
        ) : (
          <>
            <MathSelector
              selectedDifficulty={mathDifficulty}
              selectedOperation={mathOperation}
              onDifficultyChange={handleMathDifficultyChange}
              onOperationChange={handleMathOperationChange}
            />

            <MathGrid
              problems={mathProblems}
              onNumberSpeak={handleNumberSpeak}
              onSolve={handleMathSolve}
              solvedProblems={solvedProblems}
            />

            <div className="new-words-section">
              <button className="new-words-button" onClick={handleGetNewMathProblems}>
                🔄 Get New Problems! 🎉
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>🎉 Keep practicing, Mr. Pintu Pant! 🌟</p>
      </footer>
    </div>
  );
}

export default App;
