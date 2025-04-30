import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase';


export default function RegisterForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const signIn = async (e) => {
        try {
            e.preventDefault();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });

            const conversationRef = collection(db, "users", user.uid, "conversations");
            const conversationDoc = await addDoc(conversationRef, {
                title: "Initial Conversation",
                createdAt: new Date(),
            });

            const messages = [
                { senderId: 'chatbot', text: 'Hey! How can I help?', timestamp: new Date('2024-01-01T12:00:00Z') },
                { senderId: 'user', text: 'What is Inquiro?', timestamp: new Date('2024-01-01T12:01:00Z') },
                { senderId: 'chatbot', text: 'Inquiro is a RAG-based application that provides users with relevant answers based on their questions. Upload some documents and try it yourself!', timestamp: new Date('2024-01-01T12:02:00Z') },
            ];

            const messagesRef = collection(db, "users", user.uid, "conversations", conversationDoc.id, "messages");
            for (const message of messages) {
                await addDoc(messagesRef, message);
            }

            setErrorCode("");
            navigate("/chat")
        }
        catch (error) {
            console.log(error);
            setErrorCode(error.code);
        }
    }

    const emailHasError =
        errorCode === "auth/invalid-email" ||
        errorCode === "auth/email-already-in-use";
    const passwordHasError = errorCode === "auth/weak-password";

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 text-white">
            <div className="font-primary mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={signIn}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium">Email address</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                className={`focus:outline-none bg-black text-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md px-3 py-1.5 text-base placeholder:text-gray-400 sm:text-sm/6 dark:bg-stone-700 dark:text-white ${emailHasError ? "border border-red-500" : "outline-1 -outline-offset-1 outline-gray-300"
                                    }`}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errorCode === "auth/invalid-email" && (
                                <p className="text-red-500 text-sm mt-1">Incorect e-mail.</p>
                            )}
                            {errorCode === "auth/email-already-in-use" && (
                                <p className="text-red-500 text-sm mt-1">This e-mail address is already taken.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                required
                                className={`bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md px-3 py-1.5 text-base placeholder:text-gray-400 sm:text-sm/6 dark:bg-stone-700 dark:text-white ${passwordHasError ? "border border-red-500" : "outline-1 -outline-offset-1 outline-gray-300"
                                    }`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errorCode === "auth/weak-password" && (
                                <p className="text-red-500 text-sm mt-1">Password should have at least 6 symbols.</p>
                            )}
                        </div>
                    </div>

                    {errorCode &&
                        !emailHasError &&
                        !passwordHasError && (
                            <p className="text-red-500 text-sm text-center">Error: {errorCode}</p>
                        )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-black dark:text-black dark:bg-white border-2 cursor-pointer px-3 py-1.5 text-sm/6 text-white shadow-xs hover:bg-stone-800 dark:hover:bg-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already have an account?
                    <a href="/auth" className="text-white hover:text-stone-300 ml-1">Login</a>
                </p>
            </div>
        </div>
    );
}