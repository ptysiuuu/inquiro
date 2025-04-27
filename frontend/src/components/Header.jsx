import logo from '../assets/Inquiro_logo.png';

export default function Header() {
    return (
        <header className="flex flex-col items-left p-6 w-2xl">
            <div className="w-44 h-44 rounded-lg overflow-hidden">
                <img
                    src={logo}
                    alt="Inquiro logo"
                    className="w-full h-full object-cover"
                />
            </div>
        </header>
    );
}
