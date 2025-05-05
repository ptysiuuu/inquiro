import { useState } from "react";

export default function ChatModalPopup({ isOpen, onClose, onSubmit, title, setTitle, isLoading }) {
    const [isError, setIsError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (title.trim() === "") {
            setIsError(true);
            return;
        }
        setIsError(false);
        onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-stone-700 dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-3">
                    <h2 className="text-xl text-white dark:text-white">New Conversation</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Conversation title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (isError && e.target.value.trim() !== "") setIsError(false);
                        }}
                        className={`w-full p-2 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:outline-none
            ${isError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"}`}
                    />
                    {isError && (
                        <p className="text-red-500 text-sm mt-1">Title is required</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition
                            ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-stone-400"}`}
                    >
                        {isLoading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
