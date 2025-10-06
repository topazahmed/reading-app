import React, { useState, useEffect } from "react";
import "./App.scss";
import "./AppThemes.scss";
import LengthSelector from "./components/LengthSelector";
import WordGrid from "./components/WordGrid";
import MathSelector, {
  MathDifficulty,
  MathOperation,
} from "./components/MathSelector";
import MathGrid from "./components/MathGrid";
import { wordsByLength, getRandomWords } from "./data/words";
import { speakWord, speakLetter, isAudioSupported } from "./utils/audio";
import {
  generateMathProblems,
  speakNumber,
  speakMathSolution,
} from "./utils/math";
import { MathProblem } from "./components/MathCard";
import VerticalCarousel from "./components/VerticalCarousel";
import VerticalDaysCarousel from "./components/VerticalDaysCarousel";
import TimeLearningModule from "./components/TimeLearningModule";
import CarsLearningModule from "./components/CarsLearningModule";
import RoadSignsLearningModule from "./components/RoadSignsLearningModule";
import CountriesLearningModule from "./components/CountriesLearningModule";

function App() {
  // Mode state
  const [currentMode, setCurrentMode] = useState<'words' | 'math' | 'month' | 'days' | 'time' | 'cars' | 'road-signs' | 'countries'>("words");

  // Words mode state
  const [selectedLength, setSelectedLength] = useState<number>(4);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string>("");

  // Math mode state
  const [mathDifficulty, setMathDifficulty] = useState<MathDifficulty>("easy");
  const [mathOperation, setMathOperation] = useState<MathOperation>("+");
  const [mathProblems, setMathProblems] = useState<MathProblem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  // Common state
  const [audioSupported, setAudioSupported] = useState<boolean>(true);

  // State for Pintu Pant image animation
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [speechText, setSpeechText] = useState("I am Mr. Pintu Pant. Thanks for learning with me.");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'funky' | 'solid'>('funky');

  const availableLengths = Object.keys(wordsByLength)
    .map(Number)
    .sort((a, b) => a - b);

  // Handle URL hash for mode switching
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === "math") {
        setCurrentMode("math");
      } else {
        setCurrentMode("words");
      }
    };

    // Set initial mode based on URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update URL hash when mode changes
  const handleModeChange = (mode: 'words' | 'math' | 'month' | 'days' | 'time' | 'cars' | 'road-signs' | 'countries') => {
    console.log("Mode changing to:", mode); // Debug log
    setCurrentMode(mode);
    window.location.hash = mode === 'math' ? 'math' : mode === 'month' ? 'month' : mode === 'cars' ? 'cars' : mode === 'road-signs' ? 'road-signs' : mode === 'countries' ? 'countries' : '';

    // Reset state when switching modes
    if (mode === 'words') {
      setCurrentPlayingWord("");
      const words = getRandomWords(selectedLength, 10);
      setCurrentWords(words);
    } else if (mode === 'math') {
      setSolvedProblems(new Set());
      const problems = generateMathProblems(mathDifficulty, mathOperation, 10);
      setMathProblems(problems);
    }
  };

  useEffect(() => {
    setAudioSupported(isAudioSupported());

    // Load voices when they become available
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };

      // Load immediately if voices are already available
      loadVoices();

      // Listen for voices loaded event
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  // Generate words when length changes (words mode)
  useEffect(() => {
    if (currentMode === "words") {
      const words = getRandomWords(selectedLength, 10);
      setCurrentWords(words);
    }
  }, [selectedLength, currentMode]);

  // Generate math problems when difficulty or operation changes (math mode)
  useEffect(() => {
    if (currentMode === "math") {
      const problems = generateMathProblems(mathDifficulty, mathOperation, 10);
      setMathProblems(problems);
      setSolvedProblems(new Set()); // Reset solved problems
    }
  }, [mathDifficulty, mathOperation, currentMode]);

  const handleLengthChange = (length: number) => {
    setSelectedLength(length);
    setCurrentPlayingWord("");
    // Generate new random words when length changes
    const words = getRandomWords(length, 10);
    setCurrentWords(words);
  };

  const handleWordSpeak = (word: string) => {
    if (!audioSupported) {
      alert("Audio is not supported in your browser");
      return;
    }

    setCurrentPlayingWord(word);
    speakWord(word);

    // Reset playing state after a delay
    setTimeout(() => {
      setCurrentPlayingWord("");
    }, 1500);
  };

  const handleLetterSpeak = (letter: string) => {
    if (!audioSupported) {
      alert("Audio is not supported in your browser");
      return;
    }

    speakLetter(letter);
  };

  const handleGetNewWords = () => {
    const words = getRandomWords(selectedLength, 10);
    setCurrentWords(words);
    setCurrentPlayingWord("");
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
      alert("Audio is not supported in your browser");
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
      const newProblems = generateMathProblems(
        mathDifficulty,
        mathOperation,
        10
      );
      setMathProblems(newProblems);
      setSolvedProblems(new Set());
    } else {
      // Show solution and speak it
      setSolvedProblems((prev) => {
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

  const toggleImageSize = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleThemeChange = (newTheme: 'funky' | 'solid') => {
    setTheme(newTheme);
    const themeLink = document.getElementById('theme-stylesheet') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = newTheme === 'funky' ? '/funky-theme.css' : '/solid-theme.css';
    }
  };

  const months = [
    { name: "January", background: "winter.jpg" },
    { name: "February", background: "valentine.jpg" },
    { name: "March", background: "spring.jpg" },
    { name: "April", background: "april.jpg" },
    { name: "May", background: "may.jpg" },
    { name: "June", background: "summer.jpg" },
    { name: "July", background: "july.jpg" },
    { name: "August", background: "august.jpg" },
    { name: "September", background: "fall.jpg" },
    { name: "October", background: "halloween.jpg" },
    { name: "November", background: "thanksgiving.jpg" },
    { name: "December", background: "christmas.jpg" },
  ];

  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = window.innerWidth <= 768;
      const modalDismissed = localStorage.getItem("modalDismissed");
      if (!isMobile && !modalDismissed) {
        setShowModal(true);
      }
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("modalDismissed", "true");
  };

  useEffect(() => {
    // Load theme from localStorage on initial render
    const savedTheme = localStorage.getItem('app-theme') as 'funky' | 'solid';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'funky') {
      root.classList.add('funky-theme');
      root.classList.remove('solid-theme');
    } else {
      root.classList.add('solid-theme');
      root.classList.remove('funky-theme');
    }
  }, [theme]);

  return (
    <div className="App">
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "500px",
              textAlign: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2>Welcome to Mr. Pintu Pant's Learning App!</h2>
            <img src="/pintupant.png" alt="Pintu Pant Icon" style={{ width: "100px", height: "100px", animation: "shake-sway 2s infinite" }} />
            <p>
              This app was designed with mobile first in mind. It should still work on all devices. There may be bugs and quirks, please forgive my inattentiveness for this as this is a hobby project and not meant for commercial purpose. But if you want to buy me coffee I will be at your nearby Tim Hortons on Friday and Saturday night. Thanks and enjoy your time with the little ones before they grow up.
            </p>
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="app-title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <header>
            <h1>
              <img
                src="/pintupant.png"
                alt="Pintu Pant Icon"
                style={{
                  position: isImageExpanded ? 'absolute' : 'relative',
                  top: isImageExpanded ? '50%' : 'auto',
                  left: isImageExpanded ? '50%' : 'auto',
                  transform: isImageExpanded ? 'translate(-50%, -50%)' : 'none',
                  zIndex: isImageExpanded ? 1000 : 'auto',
                  width: isImageExpanded ? '100%' : '30px',
                  height: isImageExpanded ? 'auto' : '30px',
                  marginRight: isImageExpanded ? '0' : '10px',
                  transition: isImageExpanded ? 'all 3s ease' : 'all 1.5s ease',
                  animation: 'shake-sway 2s infinite', // Add animation
                  cursor: 'pointer',
                }}
                onClick={toggleImageSize}
              />
              Mr. Pintu Pant
            </h1>
            {isImageExpanded && (
              <div
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  zIndex: 1000,
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}
              >
                <button
                  onClick={() => setIsImageExpanded(false)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                  }}
                >
                  X
                </button>
                <p>{speechText}</p>
                <div style={{ marginTop: '20px' }}>
                  <label>
                    <input
                      type="radio"
                      name="theme"
                      value="funky"
                      checked={theme === 'funky'}
                      onChange={() => handleThemeChange('funky')}
                    />
                    Funky Color
                  </label>
                  <label style={{ marginLeft: '20px' }}>
                    <input
                      type="radio"
                      name="theme"
                      value="solid"
                      checked={theme === 'solid'}
                      onChange={() => handleThemeChange('solid')}
                    />
                    Solid Color
                  </label>
                </div>
              </div>
            )}
            <div className="learning-mode-header">
              <span className="learning-text">Learning </span>
              <div className="dropdown-container">
                <select
                  className="mode-dropdown-header"
                  value={currentMode}
                  onChange={(e) => {
                    const newMode = e.target.value as 'words' | 'math' | 'month' | 'days' | 'time' | 'cars' | 'road-signs' | 'countries';
                    console.log("Dropdown changed to:", newMode); // Debug log
                    handleModeChange(newMode);
                  }}
                >
                  <option value="words">words</option>
                  <option value="math">math</option>
                  <option value="month">month</option>
                  <option value="days">days</option>
                  <option value="time">time</option>
                  <option value="cars">cars</option>
                  <option value="road-signs">road signs</option>
                  <option value="countries">countries</option>
                </select>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </header>
        </div>
      </div>

      <main className="App-main">
        {!audioSupported && (
          <div className="audio-warning">
            ⚠️ Audio is not supported in your browser. Please use a modern
            browser for the best experience.
          </div>
        )}

        {currentMode === "words" ? (
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
        ) : currentMode === "math" ? (
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
              <button
                className="new-words-button"
                onClick={handleGetNewMathProblems}
              >
                🔄 Get New Problems! 🎉
              </button>
            </div>
          </>
        ) : currentMode === "month" ? (
          <VerticalCarousel months={months} />
        ) : currentMode === "days" ? (
          <VerticalDaysCarousel />
        ) : currentMode === "cars" ? (
          <CarsLearningModule />
        ) : currentMode === "road-signs" ? (
          <RoadSignsLearningModule />
        ) : currentMode === "countries" ? (
          <CountriesLearningModule />
        ) : (
          <TimeLearningModule />
        )}
      </main>

      <footer className="App-footer">
        <p>🎉 Keep practicing with Mr. Pintu Pant! 🌟</p>
      </footer>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              position: 'relative',
              maxWidth: '600px',
              width: '90%',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
            <img
              src="/pintupant.png"
              alt="Pintu Pant Icon"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            />
            <div>
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="funky"
                  checked={theme === 'funky'}
                  onChange={() => handleThemeChange('funky')}
                />
                Funky Color
              </label>
              <label style={{ marginLeft: '20px' }}>
                <input
                  type="radio"
                  name="theme"
                  value="solid"
                  checked={theme === 'solid'}
                  onChange={() => handleThemeChange('solid')}
                />
                Solid Color
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
