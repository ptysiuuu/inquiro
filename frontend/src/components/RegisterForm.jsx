export default function RegisterForm() {
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 text-white">
            <div className="font-primary mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="name" className="block text-sm/6 font-medium">Name</label>
                        <div className="mt-2">
                            <input type="text" name="name" id="name" autoComplete="name" required
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md bg-white px-3 py-1.5 text-base dark:bg-stone-700 dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium">Email address</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" autoComplete="email" required
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md bg-white px-3 py-1.5 text-base dark:bg-stone-700 dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" autoComplete="new-password" required
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full dark:bg-stone-700 dark:text-white rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            className="flex w-full justify-center rounded-md dark:hover:bg-stone-400 bg-black dark:text-black dark:bg-white border-2 cursor-pointer px-3 py-1.5 text-sm/6 text-white shadow-xs hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2">
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