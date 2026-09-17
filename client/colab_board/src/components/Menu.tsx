
const menuOptions = ["Duplicate", "Send backward", "Bring forward", "Delete"]

export default function Menu({className}: {className: string}){
    return(
        <div className={`z-10 py-3 flex flex-col bg-[#F0F0F0] border border-black/25 ${className ?? ''}`}>
            {menuOptions.map(item => (
                <button
                    key={item}
                    className={`cursor-pointer px-3 ${item === 'Delete' ? 'border-t border-black/25 pt-2' : 'pb-3'}`}>
                    <p className={`text-sm text-start ${item === 'Delete' ? 'text-red-600' : 'text-black'}`}>{item}</p>
                </button>
            ))}
        </div>
    )
}