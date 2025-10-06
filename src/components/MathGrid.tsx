import React from 'react';
import MathCard, { MathProblem } from './MathCard';
import './MathGrid.scss';

interface MathGridProps {
  problems: MathProblem[];
  onNumberSpeak: (number: number) => void;
  onSolve: (problem: MathProblem) => void;
  solvedProblems: Set<string>;
}

const MathGrid: React.FC<MathGridProps> = ({
  problems,
  onNumberSpeak,
  onSolve,
  solvedProblems
}) => {
  const getProblemKey = (problem: MathProblem) => {
    return `${problem.num1}-${problem.operation}-${problem.num2}`;
  };

  if (problems.length === 0) {
    return (
      <div className="math-grid">
        <div className="math-grid-empty">
          🧮 No math problems available yet! 🤔<br />
          Select your difficulty and operation to start learning! 📚
        </div>
      </div>
    );
  }

  return (
    <div className="math-grid">
      <div className="grid-header">
        <h3>🧮 Math Problems</h3>
        <p className="problem-count">
          {problems.length} problem{problems.length !== 1 ? 's' : ''} • {solvedProblems.size} solved ✅
        </p>
      </div>
      
      <div className="problems-container">
        {problems.map((problem, index) => (
          <MathCard
            key={`${getProblemKey(problem)}-${index}`}
            problem={problem}
            onNumberSpeak={onNumberSpeak}
            onSolve={onSolve}
            showingSolution={solvedProblems.has(getProblemKey(problem))}
          />
        ))}
      </div>
    </div>
  );
};

export default MathGrid;