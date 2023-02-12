
import { get, post } from '@/common/lib/axios';

export function createRoom(userId: string) {
    const url = "/room/create";
    return post(url, { userId });
}