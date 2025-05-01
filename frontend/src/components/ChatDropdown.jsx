import React, { useEffect, useState } from 'react';

import { db, auth } from '../config/firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';

export default function ChatDropdown({ selectConversation, conversations, setConversations }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
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
                console.error("Error while loading conversations: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const handleConversationClick = async (conversation) => {
        selectConversation(conversation);
    };

    const deleteConversationWithMessages = async (conversationId) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const messagesRef = collection(db, "users", user.uid, "conversations", conversationId, "messages");
            const messagesSnapshot = await getDocs(messagesRef);

            const deletePromises = messagesSnapshot.docs.map((msgDoc) => deleteDoc(msgDoc.ref));
            await Promise.all(deletePromises);

            const conversationRef = doc(db, "users", user.uid, "conversations", conversationId);
            await deleteDoc(conversationRef);
        } catch (error) {
            console.error("Error while deleting conversation and messages: ", error);
        }
    };


    const handleDeleteConversation = async (conversationId) => {
        try {
            if (conversations.length <= 1) {
                alert("You cannot delete the last conversation.");
                return;
            }

            const user = auth.currentUser;
            if (!user) return;

            await deleteConversationWithMessages(conversationId);

            setConversations(prevConversations => {
                const updatedConversations = prevConversations
                    .filter(conversation => conversation.id !== conversationId);

                if (updatedConversations.length > 0) {
                    const sortedByNewest = [...updatedConversations].sort((a, b) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                        return dateB - dateA;
                    });

                    selectConversation(sortedByNewest[0]);
                }

                return updatedConversations;
            });
        } catch (error) {
            console.error("Error while deleting conversation: ", error);
        }
    };

    return (
        <div className="scrollbar-custom font-primary absolute right-0 mt-14 mr-4 w-60 bg-black text-white shadow-lg rounded-lg max-h-4/5 overflow-y-auto z-50 transition-opacity duration-300 animate-in fade-in-scale">
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
                        <div className="flex flex-col border-white border-3">
                            {conversations.map((conversation) => (
                                <div key={conversation.id} className="flex justify-between items-center">
                                    <button
                                        className="text-left hover:bg-gray-800 px-4 py-2 cursor-pointer w-full"
                                        onClick={() => handleConversationClick(conversation)}
                                    >
                                        {conversation.title || "Bez tytułu"}
                                    </button>
                                    <button
                                        className="text-red-500 ml-2 p-1 hover:bg-gray-800 rounded cursor-pointer"
                                        onClick={() => handleDeleteConversation(conversation.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="px-4 py-2 border-white border-3">No previous conversations</p>
                    )}
                </div>
            )}
        </div>
    );
}
