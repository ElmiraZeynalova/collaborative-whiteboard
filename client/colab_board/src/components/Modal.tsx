import { createContext } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from "react-dom"

type Props = {
    children: ReactNode
    open: boolean
    closeModal: () => void
}

type ModalContextType = () => void;
const ModalContext = createContext<ModalContextType>(() => {});

export default function Modal({ children, open, closeModal }: Props) {
    if (!open) return null;

    return createPortal(
        <ModalContext value={closeModal}>
            <div className="fixed inset-0 z-1000">
                {children}
            </div>
        </ModalContext>,
        document.body
    );
}

Modal.Container = function Container({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={className ?? "bg-[#f3f3f3] rounded-[18px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-1 border-0 outline-0 p-3"}>
            {children}
        </div>
    )
}

Modal.Overlay = function Overlay() {
    return (
        <div className="fixed inset-0 bg-black/55"></div>
    )
}

Modal.Header = function Header({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={className ?? "flex items-center justify-between"}>{children}</div>
    )
}

Modal.Content = function Content({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={className ?? "flex flex-col items-center"}>{children}</div>
    )
}