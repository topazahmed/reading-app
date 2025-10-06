import React from 'react';
import './MathSelector.scss';

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
  const difficulties: { value: MathDifficulty; label: string; emoji: string }[] = [
    { value: 'easy', label: 'Easy', emoji: '🐞' },
    { value: 'normal', label: 'Normal', emoji: '🐥' },
    { value: 'hard', label: 'Hard', emoji: '🐻' },
    { value: 'master', label: 'Master', emoji: '🐉' }
  ];
  const operations: { value: MathOperation; label: string; emoji: string }[] = [
    { value: '+', label: '', emoji: '➕' },
    { value: '-', label: '', emoji: '➖' },
    { value: '×', label: '', emoji: '✖️' },
    { value: '÷', label: '', emoji: '➗' },
    { value: 'all', label: '', emoji: '🔢' }
  ];

  return (
    <div className="math-selector">
      <div className="difficulty-section">
        <h3 className="selector-title">🎯 Difficulty Level</h3>
        <div className="difficulty-buttons">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.value}
              className={`difficulty-button ${selectedDifficulty === difficulty.value ? 'active' : ''}`}
              onClick={() => onDifficultyChange(difficulty.value)}
            >
              <span className="difficulty-emoji">{difficulty.emoji}</span>
              <span className="difficulty-text">{difficulty.label}</span>
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
              title={operation.value === 'all' ? 'All Operations' : operation.value}
            >
              <span className="operation-emoji">{operation.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathSelector;