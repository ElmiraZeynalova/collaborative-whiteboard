import type { Awareness } from 'y-protocols/awareness';
import { removeAwarenessStates } from 'y-protocols/awareness';

export function removeUserFromAwareness(awareness: Awareness, bannedUserId: string) {
  const clientIds = [...awareness.getStates().entries()]
    .filter(([, state]) => state.user?.userId === bannedUserId)
    .map(([clientId]) => clientId);

  removeAwarenessStates(awareness, clientIds, 'access revoked');
}