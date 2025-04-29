import ChatBot from './components/ChatBot.jsx';
import Header from './components/Header.jsx';
import TopNavBar from './components/TopNavBar.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-grow">
        <div className="h-full">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default App;
