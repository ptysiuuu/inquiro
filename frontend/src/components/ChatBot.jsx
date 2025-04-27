import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { TypingEffect } from './TypingEffect';

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
            console.error('Error:', error);
            setMessages([...newMessages, { sender: 'bot', text: 'Error.' }]);
        }
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="flex flex-col items-center min-h-screen space-y-2 p-2">
            {/* Wiadomości */}
            <div className="flex flex-col flex-grow space-y-2 p-2 bg-[#F5F7FA] rounded-lg shadow-lg w-full max-w-6xl overflow-y-auto max-h-[60vh]">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg font-primary ${msg.sender === 'user'
                                ? 'bg-[#4F8EF7] text-white'
                                : 'bg-[#A9B0C3] text-gray-700'
                                }`}
                        >
                            <TypingEffect text={msg.text} fontSize="text-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Formularz wiadomości */}
            <div className="flex justify-center w-full">
                <div className="flex items-center w-full max-w-6xl bg-white rounded-2xl shadow-md px-4 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-grow p-3 bg-transparent font-primary focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-black text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};
