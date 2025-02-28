import React, { useState } from 'react';
import '../styles/Quiz.css';

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="quiz-container">
        <h2>Quiz Results</h2>
        <p>You scored {score} out of {questions.length}</p>
        <button onClick={resetQuiz}>Restart Quiz</button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="question-number">
        Question {currentQuestion + 1} of {questions.length}
      </div>
      <div className="question">
        {question.text}
      </div>
      <div className="answers">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.isCorrect)}
            className="answer-button"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz; 