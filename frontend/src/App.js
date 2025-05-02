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
// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import FlashCardDeck from './components/FlashCardDeck';
import TopicSelector from './components/TopicSelector';
import ProgressDashboard from './components/ProgressDashboard';
import Settings from './components/Settings';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [userProgress, setUserProgress] = useState([]);
  const [userSettings, setUserSettings] = useState({
    dailyGoal: 10,
    notificationsEnabled: true
  });

  // Popular UPSC topics
  const popularTopics = [
    'Indian Constitution', 'Geography of India', 'Indian History',
    'Economics', 'International Relations', 'Indian Polity',
    'Environment and Ecology', 'Science and Technology', 'Current Affairs'
  ];

  useEffect(() => {
    // Get or generate device ID for user identification
    const storedDeviceId = localStorage.getItem('upscFlashcardsDeviceId');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = uuidv4();
      localStorage.setItem('upscFlashcardsDeviceId', newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  useEffect(() => {
    if (deviceId) {
      fetchUserData();
    }
  }, [deviceId]);

  useEffect(() => {
    if (selectedTopic) {
      fetchFlashcards();
    }
  }, [selectedTopic]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${deviceId}`);
      setUserProgress(response.data.progress);
      setUserSettings(response.data.settings);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

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

  const updateProgress = async (topic, flashcardsCompleted, totalFlashcards) => {
    try {
      await axios.put(`${API_URL}/users/${deviceId}/progress`, {
        topic,
        flashcardsCompleted,
        totalFlashcards
      });
      fetchUserData();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await axios.put(`${API_URL}/users/${deviceId}/settings`, newSettings);
      setUserSettings(newSettings);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await axios.put(`${API_URL}/users/${deviceId}/settings`, newSettings);
      setUserSettings(newSettings);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleCardComplete = (flashcard) => {
    // Update progress when a user completes a flashcard
    const existingProgress = userProgress.find(p => p.topic === selectedTopic);
    
    if (existingProgress) {
      const updatedCompleted = existingProgress.flashcardsCompleted + 1;
      updateProgress(selectedTopic, updatedCompleted, flashcards.length);
    } else {
      updateProgress(selectedTopic, 1, flashcards.length);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>UPSC Flashcards</h1>
          <p>AI-powered flashcards to help you ace your UPSC exams</p>
          
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/progress" className="nav-link">Progress</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            !selectedTopic ? (
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
                  <FlashCardDeck 
                    flashcards={flashcards} 
                    onCardComplete={handleCardComplete}
                  />
                )}
              </div>
            )
          } />
          
          <Route path="/progress" element={
            <ProgressDashboard 
              userProgress={userProgress} 
              dailyGoal={userSettings.dailyGoal} 
            />
          } />
          
          <Route path="/settings" element={
            <Settings 
              settings={userSettings} 
              onSaveSettings={saveSettings} 
            />
          } />
        </Routes>
        
        <footer>
          <p>© {new Date().getFullYear()} UPSC Flashcards • Join our <a href="https://t.me/yourchannelname" target="_blank" rel="noopener noreferrer">Telegram Channel</a></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
