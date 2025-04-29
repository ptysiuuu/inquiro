import logo from '../assets/Inquiro_logo_no_bg.png';
import { TypingEffect } from './TypingEffect';

export default function TopNavBar() {
    return (
        <nav>
            <div class="max-w-screen-xl flex flex-wrap items-center p-4">
                <div className="flex items-center space-x-4">
                    <img src={logo} class="w-22 h-22 object-cover" alt="Inquiro Logo" />
                    <TypingEffect text="Inquiro" textColor="text-stone-100" fontSize="text-6xl" />
                </div>
            </div>
        </nav>
    )
}