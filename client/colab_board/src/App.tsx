import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Board from './components/Board'

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/board/:id" element={<Board/>}/>
        <Route path="/" element={<NewBoard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

function NewBoard(){
  const id = crypto.randomUUID()
  return(
    <Navigate to={`/board/${id}`} replace/>
  )
}