import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { TypingEffect } from './TypingEffect';
import UploadButton from './UploadButton';
import ChatDropdown from './ChatDropdown';
import AddConversation from './AddConversation';

import { auth, db } from '../config/firebase';
import { collection, query, orderBy, getDocs, serverTimestamp, addDoc } from 'firebase/firestore';
import Popup from './Popup';
import DocDropdown from './DocDropdown';

export default function Chatbot() {
    const user = auth.currentUser;
    const location = useLocation();

    const isOnChatPage = location.pathname.startsWith("/chat");

    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConverastion] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConversations, setShowConversations] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const [showUploadInput, setShowUploadInput] = useState(false);
    const [refreshDocuments, setRefreshDocuments] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selectedConversation || !selectedConversation.id) return;

        const fetchMessages = async () => {
            try {
                const messagesRef = collection(
                    db,
                    "users",
                    auth.currentUser.uid,
                    "conversations",
                    selectedConversation.id,
                    "messages"
                );

                const q = query(messagesRef, orderBy("timestamp"));
                const querySnapshot = await getDocs(q);

                const fetchedMessages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Error while fetching messages: ", error);
            }
        };

        fetchMessages();
    }, [selectedConversation]);

    const sendMessage = async () => {
        if (Array.isArray(selectedConversation) && selectedConversation.length === 0) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        if (user) {
            const idToken = await user.getIdToken();

            if (!input.trim()) return;

            const userMessage = {
                senderId: 'user',
                text: input,
                timestamp: serverTimestamp(),
            };

            const messagesRef = collection(
                db,
                "users",
                user.uid,
                "conversations",
                selectedConversation.id,
                "messages"
            );

            await addDoc(messagesRef, userMessage);

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            let inputData = input;
            setInput('');
            setIsLoading(true);

            const messageHistory = messages.slice(-10).map(msg => ({
                role: msg.senderId === 'user' ? 'user' : 'bot',
                content: msg.text
            }));

            try {
                const response = await fetch('http://localhost:8000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        message: inputData,
                        history: messageHistory,
                    }),
                });

                const data = await response.json();

                const botMessage = {
                    senderId: 'bot',
                    text: data.reply,
                    timestamp: serverTimestamp(),
                };

                await addDoc(messagesRef, botMessage);

                setMessages([...newMessages, botMessage]);
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response);
                    console.error('Error data:', await error.response.text());
                }
                console.error('Error:', error);
                const errorMessage = {
                    senderId: 'bot',
                    text: 'Error.',
                    timestamp: serverTimestamp(),
                };

                await addDoc(messagesRef, errorMessage);

                setMessages([...newMessages, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const handleClickConversations = () => {
        setShowConversations(prev => !prev);
    }

    const handleClickDocuments = () => {
        setShowDocuments(prev => !prev);
    }

    useEffect(() => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                console.log('Scrolling to messages end...');
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, [messages]);

    return (
        <div className="flex flex-col max-h-screen min-h-[80vh] flex-grow h-full items-center space-y-2 p-2">
            {showPopup && <Popup textFail="First select a chat" textSucces="" error={true} />}
            <div className="flex flex-row w-screen">
                <div className="flex flex-col justify-start items-center space-x-10 ml-1.5 pl-5">
                    <button
                        className="hover:bg-gray-800 rounded-xl p-2 dark:hover:bg-stone-400 bg-black shadow-md transition duration-200 cursor-pointer dark:bg-white"
                        title="Show Documents"
                        onClick={handleClickDocuments}
                    >
                        <div className="relative w-6 h-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`absolute inset-0 transition-all duration-300 transform ${showDocuments ? "opacity-0 scale-95" : "opacity-100 scale-100"} text-white dark:text-black`}>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`absolute inset-0 transition-all duration-300 transform ${showDocuments ? "opacity-100 scale-100" : "opacity-0 scale-95"} text-white dark:text-black`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>
                        </div>

                    </button>
                </div>
                <div className="flex justify-end items-center max-w-2xl ml-auto space-x-10 pr-2 mr-1.5 ">
                    <p className="font-primary text-white rounded-xl px-4 py-2 w-fit">
                        {selectedConversation.title != undefined ? `Selected chat: ${selectedConversation.title}` : "Select a chat"}
                    </p>
                    {isOnChatPage ? <AddConversation
                        setConversations={setConversations}
                        selectConversation={setSelectedConverastion}
                    /> : undefined}
                    <button
                        className="hover:bg-gray-800 rounded-xl p-2 dark:hover:bg-stone-400 bg-black shadow-md transition duration-200 cursor-pointer dark:bg-white"
                        onClick={handleClickConversations}
                        title='Show Chats'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-6 text-white dark:text-black transition-transform duration-300 ${showConversations ? "rotate-90" : "rotate-0"}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {showConversations && <ChatDropdown
                selectConversation={setSelectedConverastion}
                setConversations={setConversations}
                conversations={conversations}
                show={setShowConversations}
            />}
            {showDocuments && <DocDropdown refresh={refreshDocuments} setRefresh={setRefreshDocuments} />}
            <div className="flex flex-col overflow-y-auto max-h-[70vh] flex-grow space-y-2 p-2 bg-transparetn dark:bg-transparent w-full max-w-7xl scrollbar-custom">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xl p-3 rounded-lg font-primary ${msg.senderId === 'user'
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
                <div className="flex items-center w-full max-w-7xl bg-transparent border-2 border-white rounded-2xl shadow-md px-4 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-grow mr-2 p-3 bg-transparent font-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-white transition-all duration-300"
                    />
                    <div className="flex items-center space-x-1">
                        <UploadButton
                            setShowUploadInput={setShowUploadInput}
                            showUploadInput={showUploadInput}
                            setShowDocuments={setShowDocuments}
                            setRefresh={setRefreshDocuments}
                        />
                        {!isLoading ? (
                            <button
                                onClick={sendMessage}
                                className="bg-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:text-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                className="bg-black text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spin dark:text-black">
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
