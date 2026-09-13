import {createContext} from 'react'
import styles from './Modal.module.css'
import type { ReactNode } from 'react'
import { createPortal } from "react-dom"

type Props = {
    children: ReactNode
    open: boolean
    closeModal: () => void

}

type ModalContextType = () => void;
const ModalContext = createContext<ModalContextType>(() => {});

export default function Modal({children, open, closeModal}: Props){
    if (!open) return null;

    return createPortal(
        <ModalContext value={closeModal}>
            <div className={styles.modal}>
                {children}
            </div>
        </ModalContext>,
        document.body
    );
}

Modal.Container = function Container({children, className}: {children: ReactNode, className?: string}){
    return(
        <div className={`${className ?? styles.container}`}>{children}</div>
    )
}

Modal.Overlay = function Overlay(){
    // const closeModal = useContext(ModalContext)
    return(
        <div className={styles.overlay}></div>
    )
}

Modal.Header = function Header({children, className}: {children: ReactNode, className?: string}) {
    return(
        <div className={`${className ?? styles.header}`}>{children}</div>
    )
}

Modal.Content = function Content({children, className}: {children: ReactNode, className?: string}){
    return(
        <div className={`${className ?? styles.content}`}>{children}</div>
    )
}