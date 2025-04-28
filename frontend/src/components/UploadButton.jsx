import { useState } from "react";

export default function UploadButton() {
    const [file, setFile] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [fileContent, setFileContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleChangeFile = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const handleUpload = async () => {
        setShowInput(false);

        if (!file) {
            alert('Najpierw wybierz plik.');
            return;
        }

        try {
            const content = await readFileContent(file);
            setFileContent(content);

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8000/documents', {
                method: 'POST',
                body: JSON.stringify({ content }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Błąd podczas wysyłania pliku');
            }

            const result = await response.json();
            console.log('Sukces:', result);

            setShowPopup(true);

            setTimeout(() => setShowPopup(false), 3000);

            setFile(null);
            setFileContent("");

        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    const handleButtonClick = () => {
        setShowInput(prev => !prev);
    };

    return (
        <div className="relative inline-block">
            {showPopup && (
                <div className="absolute top-[-700px] left-[-450px] transform -translate-x-1/2 bg-green-500 text-white p-4 rounded shadow-lg w-[200px] text-center animate-pulse">
                    Upload Succesfull!
                </div>
            )}

            <button
                onClick={handleButtonClick}
                className="bg-black text-white font-primary p-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
            </button>

            {showInput && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black p-4 rounded shadow-lg w-[150px]">
                    {file && (
                        <div className="mb-2 text-sm text-gray-400">
                            Selected file: {file.name}
                        </div>
                    )}
                    <label
                        htmlFor="files"
                        className="font-primary block w-full rounded-full text-center py-2 border border-gray-600 text-stone-200 cursor-pointer hover:bg-gray-700 transition"
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
