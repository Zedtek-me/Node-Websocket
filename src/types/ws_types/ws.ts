import { WebSocketServer } from "ws";

export type WebSocketType = WebSocketServer | null | undefined;

export type MessageType = { [key: string]: unknown } | string;

export enum MessageTypes {
    PRIVATE = "private",
    GROUP = "group",
    BROADCAST = "broadcasts",
}

export type ConsumerMessageType = {
    content: string,
    fields: Object,
    properties: Object
}