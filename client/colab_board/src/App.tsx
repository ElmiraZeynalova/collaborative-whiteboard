import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom'
import Board from './components/Board'
import Dashboard from './components/Dashboard'
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from '@hocuspocus/provider-react'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/board/:id" element={<BoardPage />} />
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
            <HocuspocusRoom name={`board-${id}`} onAwarenessUpdate={({states}) => console.log(states)} onStateless={({payload}) => console.log(payload)}>
                <Board />
            </HocuspocusRoom>
        </HocuspocusProviderWebsocketComponent>
    )
}

