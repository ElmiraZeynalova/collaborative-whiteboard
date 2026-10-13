import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom'
import Board from './components/Board/Board'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from '@hocuspocus/provider-react'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/boards/:id" element={<BoardPage />} />
            </Routes>
        </BrowserRouter>
    )
}

function BoardPage() {
    const { id } = useParams()

    if (!id) {
        return <Navigate to="/" replace />
    }

    return (
        <HocuspocusProviderWebsocketComponent url="ws://127.0.0.1:1234">
            <HocuspocusRoom name={`board-${id}`} onStateless={({payload}) => console.log(payload)}>
                <Board />
            </HocuspocusRoom>
        </HocuspocusProviderWebsocketComponent>
    )
}

