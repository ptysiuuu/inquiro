import logo from '../assets/Inquiro_logo.png';
import { TypingEffect } from './TypingEffect';

export default function Header() {
    return (
        <header className="flex flex-col items-center w-full p-6">
            <div className="w-44 h-44 rounded-lg overflow-hidden">
                <img
                    src={logo}
                    alt="Inquiro logo"
                    className="w-full h-full object-cover"
                />
            </div>
            <TypingEffect text="Your only knowledge source" />
        </header>
    );
}
