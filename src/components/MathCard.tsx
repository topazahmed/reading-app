import React from 'react';
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
          ) : (
            <span className="question-mark">?</span>
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