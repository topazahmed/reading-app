import React from 'react';
import './MathSelector.css';

export type MathDifficulty = 'easy' | 'normal' | 'hard' | 'master';
export type MathOperation = '+' | '-' | '×' | '÷' | 'all';

interface MathSelectorProps {
  selectedDifficulty: MathDifficulty;
  selectedOperation: MathOperation;
  onDifficultyChange: (difficulty: MathDifficulty) => void;
  onOperationChange: (operation: MathOperation) => void;
}

const MathSelector: React.FC<MathSelectorProps> = ({
  selectedDifficulty,
  selectedOperation,
  onDifficultyChange,
  onOperationChange
}) => {
  const difficulties: MathDifficulty[] = ['easy', 'normal', 'hard', 'master'];
  const operations: { value: MathOperation; label: string; emoji: string }[] = [
    { value: '+', label: 'Addition', emoji: '➕' },
    { value: '-', label: 'Subtraction', emoji: '➖' },
    { value: '×', label: 'Multiplication', emoji: '✖️' },
    { value: '÷', label: 'Division', emoji: '➗' },
    { value: 'all', label: 'All Operations', emoji: '🔢' }
  ];

  return (
    <div className="math-selector">
      <div className="difficulty-section">
        <h3 className="selector-title">🎯 Difficulty Level</h3>
        <div className="difficulty-buttons">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              className={`difficulty-button ${selectedDifficulty === difficulty ? 'active' : ''}`}
              onClick={() => onDifficultyChange(difficulty)}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="operation-section">
        <h3 className="selector-title">🧮 Math Operation</h3>
        <div className="operation-buttons">
          {operations.map((operation) => (
            <button
              key={operation.value}
              className={`operation-button ${selectedOperation === operation.value ? 'active' : ''}`}
              onClick={() => onOperationChange(operation.value)}
              title={operation.label}
            >
              <span className="operation-emoji">{operation.emoji}</span>
              <span className="operation-symbol">{operation.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathSelector;