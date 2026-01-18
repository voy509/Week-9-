import { useEffect } from 'react';
import WeeklyBudgetPlanner from './components/WeeklyBudgetPlanner';
import storage from './utils/storage';

function App() {
  useEffect(() => {
    // Initialize storage on app mount
    // This ensures window.storage is available for the component
    console.log('Storage initialized:', storage);
  }, []);

  return (
    <div className="App">
      <WeeklyBudgetPlanner />
    </div>
  );
}

export default App;
