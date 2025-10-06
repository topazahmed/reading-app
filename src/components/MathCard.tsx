import React, { useState, useEffect } from 'react';
import './MathCard.scss';

export interface MathProblem {
  num1: number;
  num2: number;
  operation: '+' | '-' | '×' | '÷';
  answer: number;
}

interface MathCardProps {
  problem: MathProblem;
  onNumberSpeak: (number: number) => void;
  onSolve: (problem: MathProblem) => void;
  showingSolution: boolean;
}

const MathCard: React.FC<MathCardProps> = ({
  problem,
  onNumberSpeak,
  onSolve,
  showingSolution
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenAnswer, setSpokenAnswer] = useState<number | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Heard:', transcript);
        
        // Extract number from transcript
        const number = extractNumber(transcript);
        if (number !== null) {
          setSpokenAnswer(number);
          onNumberSpeak(number);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset spoken answer when problem changes
  useEffect(() => {
    setSpokenAnswer(null);
  }, [problem]);

  const extractNumber = (text: string): number | null => {
    // Remove common words
    const cleaned = text.replace(/the|answer|is|equals|equal/gi, '').trim();
    
    // Word to number mapping
    const wordToNumber: { [key: string]: number } = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
      'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
      'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
      'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
      'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100
    };

    // Try to find a direct number
    const directMatch = cleaned.match(/-?\d+/);
    if (directMatch) {
      return parseInt(directMatch[0], 10);
    }

    // Try to match word numbers
    const words = cleaned.split(/\s+/);
    for (const word of words) {
      if (wordToNumber[word] !== undefined) {
        return wordToNumber[word];
      }
    }

    // Handle compound numbers like "twenty five"
    let total = 0;
    for (const word of words) {
      if (wordToNumber[word] !== undefined) {
        total += wordToNumber[word];
      }
    }
    
    return total > 0 ? total : null;
  };

  const handleMicClick = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleRetry = () => {
    setSpokenAnswer(null);
    setIsListening(false);
  };

  const operationSymbols = {
    '+': '➕',
    '-': '➖',
    '×': '✖️',
    '÷': '➗'
  };

  return (
    <div className="math-card">
      <div className="math-problem">
        <button
          className="number-button"
          onClick={() => onNumberSpeak(problem.num1)}
        >
          {problem.num1}
        </button>
        
        <span className="operation-symbol">
          {operationSymbols[problem.operation]}
        </span>
        
        <button
          className="number-button"
          onClick={() => onNumberSpeak(problem.num2)}
        >
          {problem.num2}
        </button>
        
        <span className="equals-symbol">=</span>
        
        <div className="answer-section">
          {showingSolution ? (
            <button
              className="answer-button solved"
              onClick={() => onNumberSpeak(problem.answer)}
            >
              {problem.answer}
            </button>
          ) : spokenAnswer !== null ? (
            <div className="spoken-answer-display">
              <span className={`spoken-number ${spokenAnswer === problem.answer ? 'correct' : 'incorrect'}`}>
                {spokenAnswer}
              </span>
              {spokenAnswer === problem.answer ? (
                <span className="feedback-icon">✅</span>
              ) : (
                <>
                  <span className="feedback-icon">❌</span>
                  <button
                    className="retry-button"
                    onClick={handleRetry}
                    title="Try again"
                  >
                    🔄
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="answer-input-section">
              <span className="question-mark">?</span>
              <button
                className={`mic-button ${isListening ? 'listening' : ''}`}
                onClick={handleMicClick}
                title="Speak your answer"
              >
                {isListening ? '🎙️' : '🎤'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <button
        className="solve-button"
        onClick={() => onSolve(problem)}
      >
        {showingSolution ? '🔄 New Problem' : '💡 Solve!'}
      </button>
    </div>
  );
};

export default MathCard;