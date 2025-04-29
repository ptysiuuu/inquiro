import { useState } from 'react';
import ChatBot from './components/ChatBot.jsx';
import Header from './components/Header.jsx';
import TopNavBar from './components/TopNavBar.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`min-h-screen flex flex-col dark:bg-gray-800 dark:bg-gradient-to-t dark:from-black dark:via-[#0b0f1a] dark:to-[#1a1f2e]" ${darkMode ? "dark" : undefined}`}>
      <TopNavBar enableDarkMode={setDarkMode} darkMode={darkMode} />
      <main className="flex-grow">
        <div className="h-full">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default App;
