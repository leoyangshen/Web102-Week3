// src/Card.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './Card.css'; // Your existing card styles

// Use forwardRef to allow App.jsx to attach a ref to Card
const Card = forwardRef(({ id, frontContent, backContent, correctAnswer, isFlipped, guessStatus, onGuessSubmit, onShowAnswer }, ref) => {
  const [currentGuess, setCurrentGuess] = useState('');

  // Reset guess input when the card ID changes (i.e., we navigate to a new card)
  useEffect(() => {
    setCurrentGuess('');
  }, [id]);

  // Expose a method to clear guess input if needed by parent (e.g., when navigating)
  useImperativeHandle(ref, () => ({
    clearGuessInput() {
      setCurrentGuess('');
    }
  }));

  const cardClass = `card ${isFlipped ? 'flipped' : ''}`;

  const handleChange = (e) => {
    setCurrentGuess(e.target.value);
  };

  const handleSubmit = () => {
    onGuessSubmit(id, currentGuess);
  };

  const handleShowAnswerClick = () => {
    onShowAnswer(id);
  };

  return (
    <div className="card-container">
      <div className="card-inner-wrapper">
        <div className={cardClass}>
          {/* Front Face */}
          <div className="card-face card-front">
            <p className="card-text">{frontContent}</p>
            {/* Input box and submit button appear on the front face */}
            {!isFlipped && ( // Only show input/submit if not flipped
              <div className="guess-section">
                <input
                  type="text"
                  value={currentGuess}
                  onChange={handleChange}
                  placeholder="Type your guess here"
                  className="guess-input"
                  disabled={guessStatus === 'correct'} // Disable input if already correct
                />
                <button
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={currentGuess.trim() === '' || guessStatus === 'correct'} // Disable if input is empty or already correct
                >
                  Submit Guess
                </button>
                {guessStatus === 'correct' && <p className="feedback correct">Correct!</p>}
                {guessStatus === 'incorrect' && <p className="feedback incorrect">Try again!</p>}
                <button
                  onClick={handleShowAnswerClick}
                  className="show-answer-button"
                  disabled={isFlipped} // Disable if already flipped
                >
                  Show Answer
                </button>
              </div>
            )}
          </div>

          {/* Back Face */}
          <div className="card-face card-back">
            <p className="card-text">
              **Answer:** <br/> {backContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;
