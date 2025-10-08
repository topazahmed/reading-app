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
import BooksLearningModule from "./components/BooksPage";
import TimesTableModule from "./components/TimesTableModule";

function App() {
  // Mode state - Initialize from localStorage or default to 'words'
  type ModeType = 'words' | 'math' | 'month' | 'days' | 'time' | 'cars' | 'road-signs' | 'countries' | 'books' | 'times-table';
  const [currentMode, setCurrentMode] = useState<ModeType>(() => {
    const savedMode = localStorage.getItem('learningMode');
    if (savedMode && ['words', 'math', 'month', 'days', 'time', 'cars', 'road-signs', 'countries', 'books', 'times-table'].includes(savedMode)) {
      return savedMode as ModeType;
    }
    return 'words';
  });

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

  // Voice preference state
  const [voicePreference, setVoicePreference] = useState<'mom' | 'dad'>(() => {
    const savedVoice = localStorage.getItem('voicePreference');
    return (savedVoice === 'dad' || savedVoice === 'mom') ? savedVoice : 'mom';
  });

  // Module menu state
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);

  const availableLengths = Object.keys(wordsByLength)
    .map(Number)
    .sort((a, b) => a - b);

  // Auto-speak when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const message = "Hello friend, I am Mr. Pintu Pant. Thanks for learning with me.";
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isModalOpen]);

  // Handle URL hash for mode switching
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      const hashToModeMap: { [key: string]: ModeType } = {
        'math': 'math',
        'month': 'month',
        'days': 'days',
        'time': 'time',
        'cars': 'cars',
        'road-signs': 'road-signs',
        'countries': 'countries',
        'books': 'books',
        'times-table': 'times-table',
        '': 'words'
      };
      
      const newMode = hashToModeMap[hash] || 'words';
      setCurrentMode(newMode);
      localStorage.setItem('learningMode', newMode);
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
  const handleModeChange = (mode: ModeType) => {
    console.log("Mode changing to:", mode); // Debug log
    
    // Save to localStorage for persistence
    localStorage.setItem('learningMode', mode);
    
    // Update mode state
    setCurrentMode(mode);
    
    // Update URL hash
    const hashMap: { [key: string]: string } = {
      'math': 'math',
      'month': 'month',
      'days': 'days',
      'time': 'time',
      'cars': 'cars',
      'road-signs': 'road-signs',
      'countries': 'countries',
      'books': 'books',
      'times-table': 'times-table',
      'words': ''
    };
    
    // Use replaceState to avoid history clutter
    if (hashMap[mode] !== undefined) {
      window.location.hash = hashMap[mode];
    }

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

  // Persist current mode to localStorage whenever it changes
  useEffect(() => {
    console.log("Current mode updated to:", currentMode);
    localStorage.setItem('learningMode', currentMode);
  }, [currentMode]);

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

  const handleVoiceChange = (newVoice: 'mom' | 'dad') => {
    setVoicePreference(newVoice);
    localStorage.setItem('voicePreference', newVoice);
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
              <button
                className="mode-selector-button"
                onClick={() => setIsModuleMenuOpen(true)}
              >
                <span className="current-mode">
                  {currentMode === 'road-signs' ? 'road signs' : currentMode === 'books' ? 'my books' : currentMode}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
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
        ) : currentMode === "books" ? (
          <BooksLearningModule />
        ) : currentMode === "times-table" ? (
          <TimesTableModule />
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
            <div style={{
              position: 'relative',
              backgroundColor: '#f0f0f0',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '15px solid #f0f0f0',
              }}></div>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                color: '#333',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.5',
              }}>
                "Hello friend, I am Mr. Pintu Pant. Thanks for learning with me."
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#e8f4f8',
              border: '2px solid #4a90e2',
              borderRadius: '15px',
              padding: '20px',
              marginTop: '20px',
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '1.3rem',
                color: '#2c5aa0',
                fontFamily: 'Fredoka One, cursive',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                ⚙️ Settings
              </h3>
              
              <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '15px',
              }}>
                <p style={{
                  margin: '0 0 10px 0',
                  fontSize: '1rem',
                  color: '#555',
                  fontWeight: 'bold',
                }}>
                  Theme:
                </p>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginRight: '20px',
                }}>
                  <input
                    type="radio"
                    name="theme"
                    value="funky"
                    checked={theme === 'funky'}
                    onChange={() => handleThemeChange('funky')}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333' }}>🎨 Funky Colors</span>
                </label>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}>
                  <input
                    type="radio"
                    name="theme"
                    value="solid"
                    checked={theme === 'solid'}
                    onChange={() => handleThemeChange('solid')}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333' }}>🎯 Solid Colors</span>
                </label>

                <hr style={{
                  margin: '20px 0',
                  border: 'none',
                  borderTop: '1px solid #e0e0e0',
                }} />

                <p style={{
                  margin: '0 0 10px 0',
                  fontSize: '1rem',
                  color: '#555',
                  fontWeight: 'bold',
                }}>
                  Voice:
                </p>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginRight: '20px',
                }}>
                  <input
                    type="radio"
                    name="voice"
                    value="mom"
                    checked={voicePreference === 'mom'}
                    onChange={() => handleVoiceChange('mom')}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333' }}>👩 Mom</span>
                </label>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}>
                  <input
                    type="radio"
                    name="voice"
                    value="dad"
                    checked={voicePreference === 'dad'}
                    onChange={() => handleVoiceChange('dad')}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333' }}>👨 Dad</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-page Module Menu */}
      {isModuleMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <div style={{
            padding: '20px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{
              color: 'white',
              margin: 0,
              fontSize: '1.8rem',
              fontFamily: 'Fredoka One, cursive',
            }}>
              Choose a Module
            </h2>
            <button
              onClick={() => setIsModuleMenuOpen(false)}
              style={{
                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}>
            {[
              { mode: 'words' as const, icon: '📝', label: 'Words', color: '#667eea' },
              { mode: 'math' as const, icon: '🔢', label: 'Math', color: '#f093fb' },
              { mode: 'month' as const, icon: '📅', label: 'Months', color: '#4facfe' },
              { mode: 'days' as const, icon: '🗓️', label: 'Days', color: '#43e97b' },
              { mode: 'time' as const, icon: '⏰', label: 'Time', color: '#fa709a' },
              { mode: 'cars' as const, icon: '🚗', label: 'Cars', color: '#30cfd0' },
              { mode: 'road-signs' as const, icon: '🚸', label: 'Road Signs', color: '#a8edea' },
              { mode: 'countries' as const, icon: '🌍', label: 'Countries', color: '#ffd89b' },
              { mode: 'books' as const, icon: '📚', label: 'My Books', color: '#c471f5' },
              { mode: 'times-table' as const, icon: '✖️', label: 'Times Table', color: '#ff6b9d' },
            ].map((module) => (
              <button
                key={module.mode}
                onClick={() => {
                  handleModeChange(module.mode);
                  setIsModuleMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '20px',
                  marginBottom: '15px',
                  background: currentMode === module.mode 
                    ? `linear-gradient(135deg, ${module.color} 0%, ${module.color}dd 100%)`
                    : 'rgba(255, 255, 255, 0.1)',
                  border: currentMode === module.mode 
                    ? `3px solid ${module.color}` 
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  if (currentMode !== module.mode) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMode !== module.mode) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <span style={{
                  fontSize: '3rem',
                  marginRight: '20px',
                }}>
                  {module.icon}
                </span>
                <div style={{
                  textAlign: 'left',
                  flex: 1,
                }}>
                  <h3 style={{
                    margin: 0,
                    color: 'white',
                    fontSize: '1.5rem',
                    fontFamily: 'Fredoka One, cursive',
                    textTransform: 'uppercase',
                  }}>
                    {module.label}
                  </h3>
                  {currentMode === module.mode && (
                    <p style={{
                      margin: '5px 0 0 0',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                    }}>
                      ✓ Currently Active
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: '2rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
