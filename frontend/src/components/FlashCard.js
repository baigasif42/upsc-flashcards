// frontend/src/components/FlashCard.js
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const FlashCard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handlers = useSwipeable({
    onSwipedUp: () => flipCard(),
    onSwipedDown: () => flipCard(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={flipCard}
      {...handlers}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="card-content">
            <h3>{question}</h3>
            <p className="hint">Tap to reveal answer or swipe up/down</p>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="card-content">
            <p>{answer}</p>
            <p className="hint">Tap to see question again</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
