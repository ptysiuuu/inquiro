import logo from '../assets/Inquiro_logo.png';
import { TypingEffect } from './TypingEffect';

export default function Header() {
    return (
        <header className="absolute top-0 right-0 flex flex-col items-center p-6">
            <div className="w-40 h-40 rounded-lg overflow-hidden">
                <img
                    src={logo}
                    alt="Inquiro logo"
                    className="w-full h-full object-cover"
                />
            </div>
            <TypingEffect text="Your only knowledge source" fontSize="text-2xl" textColor="text-stone-100" />
        </header>
    );
}
