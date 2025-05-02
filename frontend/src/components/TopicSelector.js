// frontend/src/components/TopicSelector.js
import React from 'react';

const TopicSelector = ({ 
  popularTopics, 
  onSelectTopic, 
  topicInput, 
  setTopicInput, 
  onSubmitCustomTopic 
}) => {
  return (
    <div className="topic-selector">
      <h2>Select a Topic</h2>
      
      <div className="popular-topics">
        <h3>Popular Topics</h3>
        <div className="topics-grid">
          {popularTopics.map((topic, index) => (
            <button 
              key={index} 
              className="topic-btn"
              onClick={() => onSelectTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      
      <div className="custom-topic">
        <h3>Or Enter Your Own Topic</h3>
        <form onSubmit={onSubmitCustomTopic}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="E.g., Article 370, Green Revolution, etc."
          />
          <button 
            type="submit"
            disabled={!topicInput.trim()}
          >
            Create Flashcards
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopicSelector;
