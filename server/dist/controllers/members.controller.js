import { changeUsername } from '../services/members.service.js';
export async function changeUserName(req, res) {
    try {
        const { name } = req.body;
        const user = await changeUsername(req.user.id, name);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
