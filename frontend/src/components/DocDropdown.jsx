import { useState, useEffect } from "react";

import { auth } from "../config/firebase";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DocDropdown({ refresh, setRefresh }) {
    const user = auth.currentUser;

    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`${apiUrl}/documents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            const data = await response.json();
            console.log(data.docs)
            setDocuments(data.docs);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();

        if (refresh) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 3000);
            setRefresh(false);
        }
    }, [refresh])

    const handleDeleteDocument = async (documentId) => {
        try {
            setIsLoading(true);
            const user = auth.currentUser;
            const idToken = await user.getIdToken();

            const response = await fetch(`${apiUrl}/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete document");
            }

            const result = await response.json();
            console.log("Deleted:", result);

            await fetchDocuments();

        } catch (error) {
            console.error("Error deleting document:", error);
        }
        setIsLoading(false);
    };


    return (
        <div className="scrollbar-custom font-primary absolute left-0 mt-14 ml-4 w-60 bg-black text-white shadow-lg rounded-lg max-h-4/5 overflow-y-auto z-50 transition-opacity duration-300 animate-in fade-in-scale"
        >
            {isLoading ? (
                <div className="flex flex-col items-center p-4">
                    <p className="mb-2">Fetching documents...</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className="size-6 animate-spin dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </div>
            ) : (
                <div className="flex flex-col">
                    {documents.length > 0 ? (
                        documents.map((doc) => (
                            <div key={doc.id} className="flex justify-between items-center">
                                <p key={doc.id} className="px-4 py-2 border-b border-gray-700">
                                    {doc.name || "Untitled document"}
                                </p>
                                <button
                                    className="text-red-500 ml-2 mr-1 p-1 hover:bg-gray-800 rounded cursor-pointer"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="px-4 py-2 border-white">No documents found</p>
                    )}
                </div>
            )}
        </div>
    );
}
