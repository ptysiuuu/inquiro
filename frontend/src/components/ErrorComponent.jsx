export default function ErrorComponent() {
    return (
        <div className="font-primary flex flex-col items-center justify-center min-h-screen text-white dark:text-white px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-6">Page not found</p>
            <a
                href="/"
                className="hover:bg-stone-400 rounded-xl p-2 dark:hover:bg-stone-400 bg-white text-black shadow-md transition duration-200 cursor-pointer dark:bg-white"
            >
                Go back home
            </a>
        </div>
    );
}
