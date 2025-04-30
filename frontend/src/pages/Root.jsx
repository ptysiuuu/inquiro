import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useDarkMode } from '../hooks/useDarkMode';

import TopNavBar from '../components/TopNavBar';

export default function RootLayout() {
    const [darkMode, setDarkMode] = useDarkMode();
    return (
        <div className={`min-h-screen flex flex-col dark:bg-gray-800 dark:bg-gradient-to-t dark:from-black dark:via-[#0b0f1a] dark:to-[#1a1f2e]" ${darkMode ? "dark" : undefined}`}>
            <TopNavBar enableDarkMode={setDarkMode} darkMode={darkMode} />
            <main className="flex-grow">
                <div className="h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}