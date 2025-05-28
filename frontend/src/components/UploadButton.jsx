import { useState } from "react";
import Popup from "./Popup";
import { auth } from "../config/firebase";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function UploadButton({ showUploadInput, setShowUploadInput, setRefresh }) {
    const user = auth.currentUser;

    const [file, setFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(false);

    const handleChangeFile = (event) => {
        const selectedFile = event.target.files[0];
        const allowedExtensions = ['pdf', 'docx', 'txt'];
        const extension = selectedFile.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            alert('Only .pdf, .docx and .txt files are allowed');
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Choose a file');
            return;
        }

        setShowUploadInput(false);
        setUploadLoading(true);

        try {
            const idToken = await user.getIdToken();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);

            const response = await fetch(`${apiUrl}/upload-document`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error while uploading file');
            }

            const result = await response.json();
            console.log('Upload success:', result);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);

            setFile(null);
            setRefresh(true);

        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(true);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            setTimeout(() => setUploadError(false), 3000);
        }

        setUploadLoading(false);
    };

    const handleButtonClick = () => {
        setShowUploadInput(prev => !prev);
    };

    return (
        <div className="relative inline-block">
            {showPopup && <Popup textFail="Upload Failed" textSucces="Upload Succesfull!" error={uploadError} />}
            {!uploadLoading ?
                <button
                    onClick={handleButtonClick}
                    className="bg-black dark:bg-white text-white font-primary p-2 dark:hover:bg-stone-400 rounded-full hover:bg-gray-800 transition cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                </button>
                :
                <button
                    className="bg-black dark:bg-white text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spin dark:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

            }
            {showUploadInput && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black p-4 rounded shadow-lg w-[150px] fade-in-scale">
                    {file && (
                        <div
                            className="font-primary mb-2 text-sm text-gray-400 break-words max-w-full"
                            title={file.name}
                        >
                            Selected file: {file.name}
                        </div>
                    )}
                    <label
                        htmlFor="files"
                        className="font-primary block w-full rounded-full text-center py-2 border-2 border-white text-stone-200 cursor-pointer hover:bg-gray-700 transition"
                    >
                        Select file
                    </label>
                    <input
                        type="file"
                        id="files"
                        onChange={handleChangeFile}
                        className="hidden"
                    />
                    <button
                        onClick={handleUpload}
                        className="mt-2 w-full bg-white text-black font-primary p-2 rounded-full hover:bg-gray-400 transition cursor-pointer"
                    >
                        Upload
                    </button>
                </div>
            )}
        </div>
    );
}
