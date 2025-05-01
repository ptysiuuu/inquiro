import { useState } from "react";
import { auth, db } from "../config/firebase";
import { collection, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";

import Popup from "./Popup";

export default function AddConversation({ setConversations, selectConversation }) {
    const [title, setTitle] = useState("");
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [createError, setCreateError] = useState(false);

    const handleClick = async () => {
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
        }
    };

    return (
        <div className="relative font-primary">
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
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 p-2 border-2 text-white placeholder:text-white border-white rounded-2xl  dark:text-black"
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
        </div>
    );
}
