import { MathProblem } from '../components/MathCard';
import type { MathDifficulty, MathOperation } from '../components/MathSelector';

// Difficulty configurations
const difficultyConfig = {
  easy: { min: 1, max: 10 },
  normal: { min: 1, max: 25 },
  hard: { min: 1, max: 50 },
  master: { min: 1, max: 100 }
};

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a single math problem
const generateProblem = (difficulty: MathDifficulty, operation: '+' | '-' | '×' | '÷'): MathProblem => {
  const config = difficultyConfig[difficulty];
  let num1: number, num2: number, answer: number;

  switch (operation) {
    case '+':
      num1 = randomInt(config.min, config.max);
      num2 = randomInt(config.min, config.max);
      answer = num1 + num2;
      break;

    case '-':
      // Ensure positive results
      num1 = randomInt(config.min + 5, config.max);
      num2 = randomInt(config.min, num1 - 1);
      answer = num1 - num2;
      break;

    case '×':
      // Keep numbers smaller for multiplication to avoid huge results
      const maxMult = Math.min(config.max, difficulty === 'easy' ? 5 : difficulty === 'normal' ? 10 : 15);
      num1 = randomInt(config.min, maxMult);
      num2 = randomInt(config.min, maxMult);
      answer = num1 * num2;
      break;

    case '÷':
      // Generate division problems that result in whole numbers
      answer = randomInt(config.min, Math.min(config.max, 20));
      num2 = randomInt(2, difficulty === 'easy' ? 5 : difficulty === 'normal' ? 8 : 12);
      num1 = answer * num2;
      break;

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  return { num1, num2, operation, answer };
};

// Generate multiple math problems
export const generateMathProblems = (
  difficulty: MathDifficulty,
  operation: MathOperation,
  count: number = 10
): MathProblem[] => {
  const problems: MathProblem[] = [];
  const operations: ('+' | '-' | '×' | '÷')[] = 
    operation === 'all' ? ['+', '-', '×', '÷'] : [operation];

  for (let i = 0; i < count; i++) {
    const selectedOperation = operations[Math.floor(Math.random() * operations.length)];
    problems.push(generateProblem(difficulty, selectedOperation));
  }

  return problems;
};

// Speak a number using text-to-speech
export const speakNumber = (number: number): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(number.toString());
    
    // Configure speech settings
    utterance.rate = 0.5; // Same speed as letters and words
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a kids/children's voice first, then female voice
    const voices = window.speechSynthesis.getVoices();
    const kidsVoice = voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('child') ||
        voice.name.toLowerCase().includes('kids') ||
        voice.name.toLowerCase().includes('boy') ||
        voice.name.toLowerCase().includes('girl') ||
        voice.name.toLowerCase().includes('junior') ||
        voice.name.toLowerCase().includes('young')
      )
    ) || voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('tessa') ||
        voice.name.toLowerCase().includes('serena')
      )
    ) || voices.find(voice => voice.lang.includes('en'));
    
    if (kidsVoice) {
      utterance.voice = kidsVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
};

// Speak the complete math problem and solution
export const speakMathSolution = (problem: MathProblem): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const operationWords = {
      '+': 'plus',
      '-': 'minus',
      '×': 'times',
      '÷': 'divided by'
    };
    
    const solutionText = `${problem.num1} ${operationWords[problem.operation]} ${problem.num2} equals ${problem.answer}`;
    const utterance = new SpeechSynthesisUtterance(solutionText);
    
    // Configure speech settings
    utterance.rate = 0.5;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use same voice selection as speakNumber
    const voices = window.speechSynthesis.getVoices();
    const kidsVoice = voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('child') ||
        voice.name.toLowerCase().includes('kids') ||
        voice.name.toLowerCase().includes('boy') ||
        voice.name.toLowerCase().includes('girl') ||
        voice.name.toLowerCase().includes('junior') ||
        voice.name.toLowerCase().includes('young')
      )
    ) || voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('tessa') ||
        voice.name.toLowerCase().includes('serena')
      )
    ) || voices.find(voice => voice.lang.includes('en'));
    
    if (kidsVoice) {
      utterance.voice = kidsVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};