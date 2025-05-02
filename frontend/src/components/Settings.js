// frontend/src/components/Settings.js
import React, { useState } from 'react';

const Settings = ({ settings, onSaveSettings }) => {
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      dailyGoal,
      notificationsEnabled
    });
  };

  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dailyGoal">Daily Goal (cards)</label>
          <input
            type="number"
            id="dailyGoal"
            min="1"
            max="100"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
          />
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            Enable Notifications
          </label>
        </div>
        
        <button type="submit" className="save-settings-btn">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
