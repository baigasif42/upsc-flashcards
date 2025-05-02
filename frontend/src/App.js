// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashCardDeck from './components/FlashCardDeck';
import TopicSelector from './components/TopicSelector';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicInput, setTopicInput] = useState('');

  // Popular UPSC topics
  const popularTopics = [
    'Indian Constitution', 'Geography of India', 'Indian History',
    'Economics', 'International Relations', 'Indian Polity',
    'Environment and Ecology', 'Science and Technology', 'Current Affairs'
  ];

  useEffect(() => {
    if (selectedTopic) {
      fetchFlashcards();
    }
  }, [selectedTopic]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/flashcards`, {
        params: { topic: selectedTopic }
      });
      
      if (response.data.length > 0) {
        setFlashcards(response.data);
        setLoading(false);
      } else {
        // If no flashcards exist for this topic, generate them
        generateFlashcards();
      }
    } catch (err) {
      setError('Failed to fetch flashcards. Please try again.');
      setLoading(false);
      console.error('Error fetching flashcards:', err);
    }
  };

  const generateFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/flashcards/generate`, {
        topic: selectedTopic,
        count: 10
      });
      
      setFlashcards(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate flashcards. Please try again.');
      setLoading(false);
      console.error('Error generating flashcards:', err);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCustomTopic = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      setSelectedTopic(topicInput.trim());
      setTopicInput('');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>UPSC Flashcards</h1>
        <p>AI-powered flashcards to help you ace your UPSC exams</p>
      </header>

      {!selectedTopic ? (
        <TopicSelector 
          popularTopics={popularTopics} 
          onSelectTopic={handleTopicSelect}
          topicInput={topicInput}
          setTopicInput={setTopicInput}
          onSubmitCustomTopic={handleCustomTopic}
        />
      ) : (
        <div className="flashcard-section">
          <div className="current-topic">
            <h2>{selectedTopic}</h2>
            <button 
              className="change-topic-btn"
              onClick={() => setSelectedTopic('')}
            >
              Change Topic
            </button>
            <button 
              className="refresh-btn"
              onClick={generateFlashcards}
              disabled={loading}
            >
              Generate New Cards
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Creating your flashcards...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchFlashcards}>Try Again</button>
            </div>
          ) : (
            <FlashCardDeck flashcards={flashcards} />
          )}
        </div>
      )}
      
      <footer>
        <p>© {new Date().getFullYear()} UPSC Flashcards • Join our <a href="https://t.me/yourchannelname" target="_blank" rel="noopener noreferrer">Telegram Channel</a></p>
      </footer>
    </div>
  );
}

export default App;
