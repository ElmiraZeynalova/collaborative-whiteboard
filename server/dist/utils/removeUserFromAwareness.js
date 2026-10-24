import { removeAwarenessStates } from 'y-protocols/awareness';
export function removeUserFromAwareness(awareness, bannedUserId) {
    const clientIds = [...awareness.getStates().entries()]
        .filter(([, state]) => state.user?.userId === bannedUserId)
        .map(([clientId]) => clientId);
    removeAwarenessStates(awareness, clientIds, 'access revoked');
}
