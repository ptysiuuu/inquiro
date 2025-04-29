import ChatBot from './components/ChatBot.jsx';
import Header from './components/Header.jsx';
import TopNavBar from './components/TopNavBar.jsx';

function App() {
  return (
    <>
      <TopNavBar />
      <main>
        <div>
          <ChatBot />
        </div>
      </main>
    </>
  );
}

export default App;
