
export default function AuthForm() {
    return (
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 text-white">
            <div class="font-primary mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium">Email address</label>
                        <div class="mt-2">
                            <input type="email" name="email" id="email" autocomplete="email" required class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full rounded-md bg-white px-3 py-1.5 text-base dark:bg-stone-700 dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium">Password</label>
                            <div class="text-sm">
                                <a href="#" class=" hover:text-stone-300">Forgot password?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="password" id="password" autocomplete="current-password" required class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block w-full dark:bg-stone-700 dark:text-white rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full dark:hover:bg-stone-400 justify-center rounded-md bg-black dark:text-black dark:bg-white border-2 cursor-pointer px-3 py-1.5 text-sm/6 text-white shadow-xs hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2">Sign in</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                    Don't have an account?
                    <a href="register" class="text-white hover:text-stone-300 ml-1">Register</a>
                </p>
            </div>
        </div>
    )
}