import { useClientStore } from "../store/clientStore"
import { useNavigate } from "react-router-dom"

export default function Dashboard(){
    const boardName = useClientStore(state => state.boardName)
    const setBoardName = useClientStore(state => state.setBoardName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const userName = useClientStore(state => state.userName)
    const loggedIn = true
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if(boardName === null || boardName === "") return 
        const id = crypto.randomUUID()
        setBoardId(id)
        navigate(`/board/${id}`)
    }

    return(
        <div className="flex justify-center h-dvh bg-[#f3f3f3] w-full">
            <div className="flex flex-col gap-2 h-full w-1/3">
                <h1 className="text-center text-4xl font-semibold mb-15 mt-40">Collaborative Whiteboard</h1>
                {loggedIn ? 
                    <div className="text-end">{userName} <button className="cursor-pointer text-[#1bb970] hover:text-black font-medium">Log out</button></div>
                    : <button className="cursor-pointer text-end text-[#D0ECDF]">Log in</button>
                }
                <div className="flex flex-col bg-white rounded-[18px] border-0 outline-0 py-5 mx-auto w-full">
                    <h3 className="text-center text-xl font-medium">Find or create board</h3>
                    <form 
                        className="flex items-center gap-2 mx-6 grow"
                        onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Board name..." 
                            className="bg-[#f3f3f3] grow my-4 px-2 py-2 rounded-lg border border-[#aaa]"
                            value={boardName ?? ""}
                            onChange={(e) => setBoardName(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium text-md rounded-lg px-4 py-2"
                        >Create</button>
                    </form>
                </div>
            </div>
        </div>

    )
}