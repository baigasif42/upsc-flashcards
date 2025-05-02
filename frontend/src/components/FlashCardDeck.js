// frontend/src/components/FlashCardDeck.js
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import FlashCard from './FlashCard';

const FlashCardDeck = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(null);

  const goToNextCard = () => {
    setExitDirection('left');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setExitDirection(null);
    }, 300);
  };

  const goToPreviousCard = () => {
    setExitDirection('right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
      );
      setExitDirection(null);
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextCard(),
    onSwipedRight: () => goToPreviousCard(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (!flashcards.length) {
    return <p>No flashcards available for this topic.</p>;
  }

  return (
    <div className="flashcard-deck-container" {...handlers}>
      <div className={`flashcard-deck ${exitDirection ? `exit-${exitDirection}` : ''}`}>
        <FlashCard 
          question={flashcards[currentIndex].question}
          answer={flashcards[currentIndex].answer}
        />
        
        <div className="card-navigation">
          <button 
            className="nav-btn prev-btn"
            onClick={goToPreviousCard}
          >
            ←
          </button>
          <div className="card-counter">
            {currentIndex + 1} / {flashcards.length}
          </div>
          <button 
            className="nav-btn next-btn"
            onClick={goToNextCard}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCardDeck;
// frontend/src/components/FlashCardDeck.js
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import FlashCard from './FlashCard';

const FlashCardDeck = ({ flashcards, onCardComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(null);
  const [completedCards, setCompletedCards] = useState([]);

  const goToNextCard = () => {
    setExitDirection('left');
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % flashcards.length;
      setCurrentIndex(nextIndex);
      setExitDirection(null);
      
      // Mark current card as completed if not already
      if (!completedCards.includes(flashcards[currentIndex]._id)) {
        const newCompletedCards = [...completedCards, flashcards[currentIndex]._id];
        setCompletedCards(newCompletedCards);
        onCardComplete(flashcards[currentIndex]);
      }
    }, 300);
  };

  const goToPreviousCard = () => {
    setExitDirection('right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
      );
      setExitDirection(null);
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextCard(),
    onSwipedRight: () => goToPreviousCard(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (!flashcards.length) {
    return <p>No flashcards available for this topic.</p>;
  }

  return (
    <div className="flashcard-deck-container" {...handlers}>
      <div className={`flashcard-deck ${exitDirection ? `exit-${exitDirection}` : ''}`}>
        <FlashCard 
          question={flashcards[currentIndex].question}
          answer={flashcards[currentIndex].answer}
        />
        
        <div className="card-navigation">
          <button 
            className="nav-btn prev-btn"
            onClick={goToPreviousCard}
          >
            ←
          </button>
          <div className="card-counter">
            {currentIndex + 1} / {flashcards.length}
          </div>
          <button 
            className="nav-btn next-btn"
            onClick={goToNextCard}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCardDeck;
