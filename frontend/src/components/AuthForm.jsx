import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const signIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setErrorCode("");
            navigate("/chat");
        }
        catch (error) {
            console.log(error);
            setErrorCode(error.code);
        }
    }

    const emailHasError = errorCode === "auth/invalid-email" || errorCode === "auth/user-not-found";
    const passwordHasError = errorCode === "auth/wrong-password";

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
                                className={`bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md px-3 py-1.5 text-base dark:bg-stone-700 dark:text-white placeholder:text-gray-400 sm:text-sm/6 ${emailHasError ? "border border-red-500" : "outline-1 -outline-offset-1 outline-gray-300"
                                    }`}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errorCode === "auth/invalid-email" && (
                                <p className="text-red-500 text-sm mt-1">Incorrect e-mail.</p>
                            )}
                            {errorCode === "auth/user-not-found" && (
                                <p className="text-red-500 text-sm mt-1">No account with this e-mail address.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
                            <div className="text-sm">
                                <a href="#" className="hover:text-stone-300">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                className={`bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md px-3 py-1.5 text-base placeholder:text-gray-400 sm:text-sm/6 dark:bg-stone-700 dark:text-white ${passwordHasError ? "border border-red-500" : "outline-1 -outline-offset-1 outline-gray-300"
                                    }`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errorCode === "auth/wrong-password" && (
                                <p className="text-red-500 text-sm mt-1">Wrong Password.</p>
                            )}
                        </div>
                    </div>

                    {errorCode && !emailHasError && !passwordHasError && (
                        <p className="text-red-500 text-sm text-center">Nieprawidłowe dane</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-black dark:text-black dark:bg-white border-2 cursor-pointer px-3 py-1.5 text-sm/6 text-white shadow-xs hover:bg-stone-800 dark:hover:bg-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Don't have an account?
                    <a href="register" className="text-white hover:text-stone-300 ml-1">Register</a>
                </p>
            </div>
        </div>
    );
}