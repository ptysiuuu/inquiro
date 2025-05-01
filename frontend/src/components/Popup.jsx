export default function Popup({ textSucces, textFail, error }) {
    return (
        <div className={`animate-in fade-in duration-1000 font-primary fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 rounded shadow-lg w-[200px] text-center animate-fade z-50 ${error ? 'bg-red-500' : 'bg-green-500'}`}>
            {error ? textFail : textSucces}
        </div>
    )
}