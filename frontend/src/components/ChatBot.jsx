import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hey! How can I help?' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
        } catch (error) {
            console.error('Błąd:', error);
            setMessages([...newMessages, { sender: 'bot', text: 'Wystąpił błąd.' }]);
        }
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {/* Wiadomości */}
            <div className="flex flex-col space-y-2 p-6 bg-[#F5F7FA] rounded-lg shadow-lg w-full max-w-6xl h-[500px] overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user'
                                ? 'bg-[#4F8EF7] text-white'
                                : 'bg-[#A9B0C3] text-gray-700'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Formularz wiadomości */}
            <div className="flex justify-center w-full mt-4">
                <div className="flex items-center w-full max-w-6xl bg-white rounded-2xl shadow-md px-4 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-grow p-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
