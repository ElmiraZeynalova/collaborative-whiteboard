import { useClientStore } from "../store/clientStore"
import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import {saveBoardToLocalStorage} from '../utils/localStorageOperations'

export default function Dashboard(){
    const boardName = useClientStore(state => state.boardName)
    const setBoardName = useClientStore(state => state.setBoardName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    function handleLogOut(){
        localStorage.removeItem("user")
        setLoggedIn(false)
    }

    function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if(boardName === null || boardName === "") return 

        const id = crypto.randomUUID()
        setBoardId(id)

        const newBoard = {id, name: boardName}
        saveBoardToLocalStorage(newBoard)

        navigate(`/board/${id}`)
    }

    return (
        <div className="flex justify-center min-h-dvh bg-[#f3f3f3] w-full px-4">
            <div className="flex flex-col gap-2 w-full max-w-md">
                <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-10 mt-20 sm:mt-40">
                    Collaborative Whiteboard
                </h1>
                {loggedIn ? (
                    <div className="text-end">
                        {/* {userName}{" "} */}
                        <button onClick={handleLogOut} className="cursor-pointer text-[#919191] hover:text-black font-medium">
                            Log out
                        </button>
                    </div>
                ) : (
                    <button className="cursor-pointer text-end text-[#919191]">Log in</button>
                )}
                <div className="flex flex-col bg-white rounded-[18px] py-5 w-full">
                    <h3 className="text-center text-xl font-medium">Find or create board</h3>
                    <form
                        className="flex items-center gap-2 mx-4 sm:mx-6"
                        onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Board name..."
                            className="bg-[#f3f3f3] grow min-w-0 my-4 px-2 py-2 rounded-lg border border-[#aaa]"
                            value={boardName ?? ""}
                            onChange={(e) => setBoardName(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="shrink-0 cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-black border-2 border-transparent font-medium rounded-lg px-4 py-2"
                        >
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}