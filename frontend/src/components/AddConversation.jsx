import { auth, db } from "../config/firebase";
import { collection, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";


export default function AddConversation({ setConversations, selectConversation }) {
    const handleClick = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const conversationDocRef = await addDoc(
                collection(db, "users", user.uid, "conversations"),
                {
                    createdAt: serverTimestamp(),
                    participants: [user.uid, "chatbot"]
                }
            );

            const newConversation = {
                id: conversationDocRef.id,
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
        } catch (error) {
            console.error("Error while opening conversations:", error);
        }
    };

    return (
        <button
            className="bg-black dark:text-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
            onClick={handleClick}
        >
            New chat
        </button>
    );
}
