import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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

    const signInGoogle = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleProvider);
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
                    <button
                        type="button"
                        className="cursor-pointer text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center mr-2 mb-2"
                        onClick={signInGoogle}
                    >
                        <svg className="mr-2 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
                            </path>
                        </svg>
                        Sign in with Google
                    </button>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Don't have an account?
                    <a href="register" className="text-white hover:text-stone-300 ml-1">Register</a>
                </p>
            </div>
        </div>
    );
}