import { auth, db } from "../config/firebase";
import { collection, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function AddConversation() {
    const navigate = useNavigate();

    const handleClick = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const conversationRef = await addDoc(
                collection(db, "users", user.uid, "conversations"),
                {
                    createdAt: serverTimestamp(),
                    participants: [user.uid, "chatbot"]
                }
            );

            await setDoc(
                doc(db, "users", user.uid, "conversations", conversationRef.id, "messages", "welcome"),
                {
                    senderId: "chatbot",
                    text: "Hey! How can I help you?",
                    timestamp: serverTimestamp()
                }
            );

            navigate(`/chat/${conversationRef.id}`);
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
