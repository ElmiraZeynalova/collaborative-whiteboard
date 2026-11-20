import {
    BrowserRouter,
    Route,
    Routes,
    Navigate,
    useParams,
    useSearchParams,
    useLocation
} from "react-router-dom";
import Board from "./components/Board/Board";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from "@hocuspocus/provider-react";
import { useClientStore, type Mode } from "./store/clientStore";
import { useQuery } from "@tanstack/react-query";
import { verifyShareAccess, getBoardMember } from "../src/api/boards.ts"
import { useEffect } from 'react'
import { useAuthState } from '../src/context/useAuthState.ts'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/boards/:id" element={<BoardPage mode="account" />} />
                <Route path="/boards/guest/:id" element={<BoardPage mode="guest" />} />
            </Routes>
        </BrowserRouter>
    );
}

function BoardPage({ mode }: { mode: Mode }) {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const shareToken = searchParams.get("share");

    const userId = useClientStore(state => state.userId);
    const { loggedIn } = useAuthState()

    const setIsBanned = useClientStore(state => state.setIsBanned);
    const setDeletedBoardId = useClientStore(state => state.setDeletedBoardId);

    const location = useLocation();

    const memberQuery = useQuery({
        queryKey: ["member", id, userId],
        queryFn: () => getBoardMember(id!, userId!),
        enabled: mode === "account" && !!id && !!userId && loggedIn === true,
    });

    const shareQuery = useQuery({
        queryKey: ["share-access", id, shareToken, userId],
        queryFn: () => verifyShareAccess(id!, shareToken!),
        enabled: mode === "account" && !!id && !!shareToken && !!userId && loggedIn === true,
    });

    useEffect(() => {
        if (shareQuery.data?.shareTokenIsValid && shareToken) {
            const url = new URL(window.location.href);
            url.searchParams.delete("share");

            window.history.replaceState({}, "", url);
        }
    }, [shareQuery.data, shareToken]);

    if (!id) {
        return <Navigate to="/" replace />;
    }

    if (mode === "account") {
        if (loggedIn === "loading" || (loggedIn === true && !userId)) {
            return <div>Loading...</div>;
        }

        if (loggedIn !== true) {
            return <Navigate to="/login" replace state={location} />;
        }

        if (shareToken) {
            if (shareQuery.isPending) {
                return <div>Loading board...</div>;
            }

            if (shareQuery.isError) {
                return <div>Failed to verify invitation.</div>;
            }

            if (shareQuery.data?.shareTokenIsValid !== true) {
                return <Navigate to="/" replace />;
            }
        } else {
            if (memberQuery.isPending) {
                return <div>Loading board...</div>;
            }

            if (memberQuery.isError) {
                return <div>Failed to verify board access.</div>;
            }

            if (!memberQuery.data) {
                return <Navigate to="/" replace />;
            }
        }
    }

    const accessToken = localStorage.getItem("accessToken") ?? "";

    function handleStateless({ payload }: { payload: string }) {
        try {
            const message = JSON.parse(payload);
            if (message.type === "access") {
                if (message.content === "access prohibited") {
                    console.log("GOT BANNED");
                    setIsBanned(true);
                }
            } else if (message.type === "connection") {
                console.log(message.content);
            } else if (message.type === "board-deleted") {
                setDeletedBoardId(message.content.boardId);
            }
        } catch (error) {
            console.error("Invalid stateless message:", error);
        }
    }

    return (
        <HocuspocusProviderWebsocketComponent
            url={import.meta.env.VITE_HOCUSPOCUS_URL}
        >
            <HocuspocusRoom
                name={mode === "guest" ? `board-guest-${id}` : `board-${id}`}
                token={accessToken}
                onStateless={handleStateless}
                onAuthenticationFailed={({ reason }) => {
                    console.error("Authentication failed:", reason);
                }}
            >
                <Board mode={mode} />
            </HocuspocusRoom>
        </HocuspocusProviderWebsocketComponent>
    );
}
