import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom'
import Board from './components/Board/Board'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from '@hocuspocus/provider-react'
import { useClientStore } from './store/clientStore'

export type Mode = "local" | "server"
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/boards/:id" element={<BoardPage mode="server"/>} />
                <Route path="/boards/local/:id" element={<BoardPage mode="local"/>} />
            </Routes>
        </BrowserRouter>
    )
}

function BoardPage({mode}: {mode: Mode}) {
    const { id } = useParams()
    const setIsBanned = useClientStore(state => state.setIsBanned)

    if (!id) {
        return <Navigate to="/" replace />
    }

    const accessToken = localStorage.getItem("accessToken") ?? ""

    function handleStateless({ payload }: { payload: string }) {
        try {
            const message = JSON.parse(payload)
            if (message.type === 'access') {
                if(message.content === "access prohibited"){
                    console.log("GOT BANNED")
                    setIsBanned(true)
                }
            }else if(message.type === "connection"){
                console.log(message.content)
            }
        } catch (error) {
            console.error('Invalid stateless message:', error)
        }
    }

    return (
        <HocuspocusProviderWebsocketComponent url="ws://127.0.0.1:1234">
            <HocuspocusRoom 
                name={mode === "local" ? `board-local-${id}` : `board-${id}`}
                token={accessToken} 
                onStateless={handleStateless} 
                onAuthenticationFailed={({ reason }) => {console.error('Authentication failed:', reason)}}>
                <Board mode={mode}/>
            </HocuspocusRoom>
        </HocuspocusProviderWebsocketComponent>
    )
}

