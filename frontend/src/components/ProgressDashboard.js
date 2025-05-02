// frontend/src/components/ProgressDashboard.js
import React from 'react';

const ProgressDashboard = ({ userProgress, dailyGoal }) => {
  // Calculate total progress across all topics
  const totalCompleted = userProgress.reduce((sum, topic) => sum + topic.flashcardsCompleted, 0);
  const totalCards = userProgress.reduce((sum, topic) => sum + topic.totalFlashcards, 0);
  const percentComplete = totalCards > 0 ? Math.round((totalCompleted / totalCards) * 100) : 0;
  
  // Check if daily goal is met
  const todayProgress = userProgress.filter(topic => {
    const lastReview = new Date(topic.lastReviewDate);
    const today = new Date();
    return lastReview.toDateString() === today.toDateString();
  }).reduce((sum, topic) => sum + topic.flashcardsCompleted, 0);
  
  const dailyGoalMet = todayProgress >= dailyGoal;

  return (
    <div className="progress-dashboard">
      <h2>Your Progress</h2>
      
      <div className="progress-stats">
        <div className="progress-stat">
          <span className="stat-number">{totalCompleted}</span>
          <span className="stat-label">Cards Reviewed</span>
        </div>
        
        <div className="progress-stat">
          <span className="stat-number">{userProgress.length}</span>
          <span className="stat-label">Topics Studied</span>
        </div>
        
        <div className="progress-stat">
          <span className="stat-number">{percentComplete}%</span>
          <span className="stat-label">Completion</span>
        </div>
      </div>
      
      <div className="daily-goal">
        <h3>Daily Goal</h3>
        <div className="goal-progress">
          <div 
            className="goal-bar" 
            style={{ width: `${Math.min(100, (todayProgress / dailyGoal) * 100)}%` }}
          ></div>
        </div>
        <div className="goal-text">
          {dailyGoalMet 
            ? <span className="goal-met">🎉 Goal achieved! ({todayProgress}/{dailyGoal})</span>
            : <span>Progress: {todayProgress}/{dailyGoal} cards</span>
          }
        </div>
      </div>
      
      {userProgress.length > 0 && (
        <div className="topic-progress">
          <h3>Topic Progress</h3>
          <ul className="topic-list">
            {userProgress.map((topic, index) => (
              <li key={index} className="topic-item">
                <div className="topic-info">
                  <span className="topic-name">{topic.topic}</span>
                  <span className="topic-stats">
                    {topic.flashcardsCompleted}/{topic.totalFlashcards} cards
                  </span>
                </div>
                <div className="topic-progress-bar">
                  <div 
                    className="topic-progress-fill" 
                    style={{ width: `${(topic.flashcardsCompleted / topic.totalFlashcards) * 100}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
