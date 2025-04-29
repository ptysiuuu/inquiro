import React, { useState, useEffect, useRef } from 'react';
import { TypingEffect } from './TypingEffect';
import UploadButton from './UploadButton';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hey! How can I help?' },
        { sender: 'user', text: 'What is Inquiro?' },
        { sender: 'bot', text: 'Inquiro is a RAG-based application that provides users with relevant answers based on their questions. Upload some documents and try it yourself!' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        let inputData = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputData }),
            });

            const data = await response.json();
            setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { sender: 'bot', text: 'Error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col max-h-screen flex-grow h-full items-center space-y-2 p-2">
            <div className="flex flex-col overflow-y-auto max-h-[70vh] flex-grow space-y-2 p-2 bg-[#F5F7FA] rounded-lg shadow-lg w-full max-w-6xl">
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
                            <TypingEffect text={msg.text} fontSize="text-md" textColor="text-stone-800" effectSpeed={0.02} font="font-sans" />
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs p-3 rounded-lg font-primary bg-[#A9B0C3] text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-bounce">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center w-full">
                <div className="flex items-center w-full max-w-6xl bg-white rounded-2xl shadow-md px-4 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-grow mr-2 p-3 bg-transparent font-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-700 placeholder-gray-400 transition-all duration-300"
                    />
                    <div className="flex items-center space-x-1">
                        <UploadButton />
                        {!isLoading ? (
                            <button
                                onClick={sendMessage}
                                className="bg-black text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                className="bg-black text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spin">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div ref={messagesEndRef} />
        </div>
    );
}
