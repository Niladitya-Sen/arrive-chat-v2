export type MessageType = {
    message: string;
    role: 'sender' | 'captain' | 'system';
    time?: string;
}