import { useState } from "react";
import { auth, db } from "../config/firebase";
import { collection, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";

import Popup from "./Popup";

export default function AddConversation({ setConversations, selectConversation }) {
    const [title, setTitle] = useState("");
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user || !title.trim()) return;

        try {
            const conversationDocRef = await addDoc(
                collection(db, "users", user.uid, "conversations"),
                {
                    title: title.trim(),
                    createdAt: serverTimestamp(),
                    participants: [user.uid, "chatbot"]
                }
            );

            const newConversation = {
                id: conversationDocRef.id,
                title: title.trim(),
                createdAt: new Date(),
                participants: [user.uid, "chatbot"]
            };

            await setDoc(
                doc(db, "users", user.uid, "conversations", conversationDocRef.id, "messages", "welcome"),
                {
                    senderId: "chatbot",
                    text: "Hey! How can I help you?",
                    timestamp: serverTimestamp()
                }
            );

            setConversations(prev => [...prev, newConversation]);
            selectConversation(newConversation);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            setTitle("");
            setIsInputVisible(false);
        } catch (error) {
            console.error("Error while opening conversation:", error);
            setCreateError(true);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            setTimeout(() => setCreateError(false), 3000);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="relative font-primary">
            {isLoading ? (
                <div className="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className="size-6 animate-spin text-white">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </div>
            ) : (
                <>
                    {showPopup && <Popup textFail="Chat creation failed" textSucces="Chat created" error={createError} />}
                    {!isInputVisible ? (
                        <button
                            className="bg-black dark:text-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
                            onClick={() => setIsInputVisible(true)}
                        >
                            New chat
                        </button>
                    ) : (
                        <>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Conversation title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 p-2 border-2 text-white placeholder:text-white border-white rounded-2xl dark:text-black"
                                />
                                <button
                                    className="bg-black max-h-12 dark:text-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleClick}
                                >
                                    Create
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
