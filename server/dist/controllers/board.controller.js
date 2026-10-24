import { getAllUserBoards, getBoardById, createServerBoard, createLocalBoard, deleteLocalBoard, deleteServerBoard, joinUserToBoard, getUserRoleAndId, updateBoardName, getBoardMembers, changeAccessToBoardByUserId, getBoardMemberByUserId, changeUserBoardRole, updateBoardNameLocaly } from '../services/board.service.js';
import { removeUserFromAwareness } from '../utils/removeUserFromAwareness.js';
import { hocuspocus } from "../index.js";
export async function getAllBoards(req, res) {
    try {
        const data = await getAllUserBoards(req.user.id);
        const boards = data.map(board => {
            return {
                id: board.id,
                name: board.name,
                userRole: board.board_members[0].role
            };
        });
        res.status(200).json(boards);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getBoard(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const board = await getBoardById(id);
        res.status(200).json(board);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function createBoard(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            const board = await createLocalBoard(req.body);
            return res.status(201).json(board);
        }
        const board = await createServerBoard(req.body, userId);
        return res.status(201).json(board);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
export async function deleteBoard(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.user?.id;
        if (!userId) {
            const board = await deleteLocalBoard(boardId);
            return res.status(200).json(board);
        }
        const documentName = `board-${boardId}`;
        const document = hocuspocus.documents.get(documentName);
        const board = await deleteServerBoard(boardId, userId);
        if (board.deleted && document) {
            document.broadcastStateless(JSON.stringify({
                type: 'board-deleted',
                content: { boardId },
            }));
        }
        return res.status(200).json(board);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
export async function joinBoard(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const member = await joinUserToBoard(req.user.id, boardId, req.body);
        res.status(200).json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getRoleAndUserId(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userRole = await getUserRoleAndId(req.user.id, id);
        if (!userRole) {
            return res.status(404).json({ error: "User role not found" });
        }
        const { role, user_id } = userRole;
        res.status(200).json({ role, userId: user_id });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function changeBoardName(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { name } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            const board = await updateBoardNameLocaly(boardId, name);
            return res.status(200).json(board);
        }
        const board = await updateBoardName(boardId, name, req.user.id);
        res.status(200).json(board);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function changeUserAccessToBoard(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        const { isAllowed } = req.body;
        const member = await changeAccessToBoardByUserId(req.user.id, boardId, userId, isAllowed);
        const documentName = `board-${boardId}`;
        const document = hocuspocus.documents.get(documentName);
        if (document) {
            removeUserFromAwareness(document.awareness, userId);
        }
        res.status(200).json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function changeUserRole(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        const { role } = req.body;
        const member = await changeUserBoardRole(req.user.id, boardId, userId, role);
        res.status(200).json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getAllBoardMembers(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const members = await getBoardMembers(id);
        res.status(200).json(members);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getBoardMember(req, res) {
    try {
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        const member = await getBoardMemberByUserId(boardId, userId);
        res.status(200).json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
