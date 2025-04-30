import { NavLink } from 'react-router-dom';

import logo from '../assets/Inquiro_logo_no_bg.png';
import { TypingEffect } from './TypingEffect';

export default function TopNavBar({ enableDarkMode, darkMode }) {
    const handleClick = () => {
        enableDarkMode(prev => !prev);
    };

    return (
        <nav>
            <div class="flex flex-wrap items-center p-4">
                <div className="flex items-center space-x-4">
                    <img src={logo} class="w-22 h-22 object-cover dark:bg-stone-200 dark:rounded-2xl" alt="Inquiro Logo" />
                    <TypingEffect text="Inquiro" textColor="text-stone-100" fontSize="text-6xl" />
                </div>
                <div className="flex items-center ml-auto space-x-10">
                    <NavLink
                        to="/auth"
                        className="bg-black dark:text-black dark:bg-white dark:hover:bg-stone-400 text-white font-primary p-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
                    >
                        Login
                    </NavLink>
                    <ul className="flex items-center space-x-2 dark:bg-transparent">
                        <li>
                            <button className=" hover:bg-gray-800 rounded-xl p-2 dark:hover:bg-stone-400 bg-black shadow-md transition duration-200 cursor-pointer dark:bg-white"
                                onClick={handleClick}
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
                                )
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                    </svg>

                                }
                            </button>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}