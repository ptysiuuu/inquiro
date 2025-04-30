import React, { useEffect, useState } from 'react';

import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function ChatDropdown() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.log("No logged user");
                    return;
                }

                const userUid = user.uid;

                setIsLoading(true);
                const conversationsRef = collection(db, "users", userUid, "conversations");
                const q = query(conversationsRef);
                const querySnapshot = await getDocs(q);
                const fetchedConversations = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setConversations(fetchedConversations);
            } catch (error) {
                console.error("Błąd podczas ładowania konwersacji: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    return (
        <div className="absolute right-0 mt-12 mr-4 w-60 bg-black text-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-50 transition-opacity duration-300 animate-in fade-in-scale">
            {isLoading ? (
                <div className="flex flex-col items-center p-4">
                    <p className="mb-2">Fetching conversations...</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className="size-6 animate-spin dark:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </div>
            ) : (
                <div>
                    {conversations.length > 0 ? (
                        <ul>
                            {conversations.map((conversation) => (
                                <li key={conversation.id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                                    {conversation.title || "Bez tytułu"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-4 py-2">Brak konwersacji</p>
                    )}
                </div>
            )}
        </div>
    );
}
