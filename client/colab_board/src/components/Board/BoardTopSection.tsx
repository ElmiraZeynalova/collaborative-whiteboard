import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../Modal'
import SideBar from './SideBar'
import { useClientStore } from '../../store/clientStore'

export default function BoardTopSection(){
    const boardName = useClientStore(state => state.boardName)
    const boardId = useClientStore(state => state.boardId)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [showUsersSideBar, setShowUsersSideBar] = useState(false)

    async function handleClick(){
        await navigator.clipboard.writeText(`${window.location.origin}/board/${boardId}`)
        setShowMessage(true)
    }

    return(
        <>
            <Modal 
                open={showModal} 
                closeModal={() => {
                    setShowModal(false)
                    setShowMessage(false)
                }
                }>
                <Modal.Overlay/>
                <Modal.Container>
                    <Modal.Header className="flex gap-10 items-center">
                        <p className="text-lg font-normal m-1">Share board link with friends</p>
                        <button 
                            className="cursor-pointer"
                            onClick={() => {
                                setShowModal(false)
                                setShowMessage(false)
                            }
                        }><Icon icon="radix-icons:cross-2" width={22} height={22} color="#919191" /></button>
                    </Modal.Header>
                    <Modal.Content className="flex flex-col items-start gap-2 mx-1 mt-2">
                            <button 
                                onClick={handleClick}
                                type="button"
                                className="cursor-pointer my-2 w-full bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-normal text-md rounded-lg py-1.5"
                            >Copy board link</button>
                            {showMessage && <p>Link copied to clipboard</p>}
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <div className="absolute top-2 left-3 right-3 z-10 flex items-center justify-between gap-2">
                <button 
                    onClick={() => navigate('/')}
                    className="cursor-pointer px-3 py-2 flex items-center justify-center gap-1 rounded-lg drop-shadow-md bg-white border border-black/15">
                    <Icon icon="gg:arrow-left" width={20} height={20} />
                    Dashboard
                </button>
            
                <div className="px-3 py-2 flex items-center gap-4 rounded-lg drop-shadow-md bg-white border border-black/15">
                    {boardName}
                    <button 
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer border-l border-black/15 pl-3">Share link</button>
                </div>
                <button 
                    onClick={() => setShowUsersSideBar(true)}
                    className="cursor-pointer px-2.5 py-2.5 flex items-center gap-4 rounded-lg drop-shadow-md bg-white border border-black/15">
                        <Icon icon="lucide:users" width={20} height={20} />
                </button>
            </div>
            
            {showUsersSideBar && 
                <>
                    <div className="fixed z-11 inset-0 bg-black/55" onClick={() => setShowUsersSideBar(false)}/>
                    <SideBar closeBar={() => setShowUsersSideBar(false)}/>
                </>
            }
        </>
    )
}