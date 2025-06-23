// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card.jsx';
import './index.css'; // Global styles and new button/feedback styles

function App() {
  const [cards, setCards] = useState([
    { id: 1, front: 'What is the capital of France?', back: 'Paris', correctAnswer: 'Paris', isFlipped: false },
    { id: 2, front: 'Which planet is known as the Red Planet?', back: 'Mars', correctAnswer: 'Mars', isFlipped: false },
    { id: 3, front: 'What is the largest ocean on Earth?', back: 'Pacific Ocean', correctAnswer: 'Pacific Ocean', isFlipped: false },
    { id: 4, front: 'Who painted the Mona Lisa?', back: 'Leonardo da Vinci', correctAnswer: 'Leonardo da Vinci', isFlipped: false },
    { id: 5, front: 'What is the chemical symbol for water?', back: 'H2O', correctAnswer: 'H2O', isFlipped: false },
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [guessStatus, setGuessStatus] = useState('idle'); // 'idle', 'correct', 'incorrect'

  const currentCard = cards[currentCardIndex];

  // Ref to reset input field in Card component when navigating
  const cardRef = useRef(null);

  // --- Handlers for Card actions ---
  const handleGuessSubmit = (id, guess) => {
    // Only process guess if the current card is the one being guessed
    if (id !== currentCard.id) return;

    const trimmedGuess = guess.trim().toLowerCase();
    const trimmedAnswer = currentCard.correctAnswer.trim().toLowerCase();

    if (trimmedGuess === trimmedAnswer) {
      setGuessStatus('correct');
      // Flip the card immediately on correct guess
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
    } else {
      setGuessStatus('incorrect');
    }
  };

  const handleShowAnswer = (id) => {
    // Only show answer if it's the current card
    if (id !== currentCard.id) return;

    setGuessStatus('idle'); // Clear any previous guess status
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
  };

  // --- Navigation Handlers ---
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setGuessStatus('idle'); // Reset guess status for the new card
      // Unflip the new card when navigating to it (unless you want it to stay flipped)
      setCards(prevCards =>
        prevCards.map((card, index) =>
          index === currentCardIndex + 1 ? { ...card, isFlipped: false } : card
        )
      );
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prevIndex => prevIndex - 1);
      setGuessStatus('idle'); // Reset guess status for the new card
      // Unflip the new card when navigating to it
      setCards(prevCards =>
        prevCards.map((card, index) =>
          index === currentCardIndex - 1 ? { ...card, isFlipped: false } : card
        )
      );
    }
  };

  const isAtStart = currentCardIndex === 0;
  const isAtEnd = currentCardIndex === cards.length - 1;

  // Effect to reset guess status and potentially card state when card index changes
  useEffect(() => {
    setGuessStatus('idle');
    // Ensure the card is unflipped when we navigate to it, unless it was just correctly guessed
    setCards(prevCards =>
        prevCards.map((card, index) => {
            if (index === currentCardIndex && card.isFlipped && guessStatus !== 'correct') {
                return { ...card, isFlipped: false };
            }
            return card;
        })
    );
  }, [currentCardIndex]); // Re-run when currentCardIndex changes

  return (
    <div className="app-container">
      <h1>Flashcard Quiz</h1>

      {currentCard ? (
        <>
          <div className="navigation-controls">
            <button className="nav-button" onClick={goToPrevCard} disabled={isAtStart}>
              Previous
            </button>
            <span className="card-counter">
              {currentCardIndex + 1} / {cards.length}
            </span>
            <button className="nav-button" onClick={goToNextCard} disabled={isAtEnd}>
              Next
            </button>
          </div>

          <Card
            key={currentCard.id} // Important for React to re-render correctly when card data changes
            id={currentCard.id}
            frontContent={currentCard.front}
            backContent={currentCard.back}
            correctAnswer={currentCard.correctAnswer}
            isFlipped={currentCard.isFlipped}
            guessStatus={guessStatus}
            onGuessSubmit={handleGuessSubmit}
            onShowAnswer={handleShowAnswer}
            ref={cardRef} // Assign ref to Card component
          />
        </>
      ) : (
        <p>No cards available.</p>
      )}
    </div>
  );
}

export default App;
