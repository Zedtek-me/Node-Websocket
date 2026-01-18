import { WebSocketServer } from "ws";

export type WebSocketType = WebSocketServer | null | undefined;

export type MessageType = {} | string;

export enum MessageTypes {
    PRIVATE = "private",
    GROUP = "group",
    BROADCAST = "broadcast",
}