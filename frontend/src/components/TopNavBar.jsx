import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import logo from '../assets/Inquiro_logo_no_bg.png';
import { TypingEffect } from './TypingEffect';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function TopNavBar({ enableDarkMode, darkMode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    const location = useLocation();

    const isOnChatPage = location.pathname.startsWith("/chat");

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleClick = () => {
        enableDarkMode(prev => !prev);
    };

    const handleClickConversations = () => {
        setShowConversations(prev => !prev);
    }

    return (
        <nav>
            <div className="flex flex-wrap items-center p-4">
                <div className="flex items-center space-x-4">
                    <img src={logo} className="w-22 h-22 object-cover dark:bg-stone-200 dark:rounded-2xl" alt="Inquiro Logo" />
                    <TypingEffect text="Inquiro" textColor="text-stone-100" fontSize="text-6xl" />
                </div>
                <div className="flex items-center ml-auto space-x-10">
                    {userEmail && isOnChatPage ? <p
                        className="font-primary text-white rounded-xl px-4 py-2 w-fit"
                    >Logged in as: {userEmail}</p> : undefined}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-black dark:text-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    )}
                    <button
                        className="hover:bg-gray-800 rounded-xl p-2 dark:hover:bg-stone-400 bg-black shadow-md transition duration-200 cursor-pointer dark:bg-white"
                        onClick={handleClick}
                        title='Switch dark mode'
                    >
                        {!darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5" stroke="currentColor" className="size-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385
                0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753
                9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753
                9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}