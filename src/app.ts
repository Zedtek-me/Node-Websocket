import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from "dotenv";
import WebSocketService from './services/ws';
import { MessageType } from './types/ws_types/ws';
import { UserType } from './types/user_types/users';
import connectToDatabase from './configs/database';
import * as settings from "./settings";
import base from "./routes/index";

connectToDatabase();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(base);

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });
const PORT = settings.PORT || 4000;

wss.on("connection", (ws: WebSocketServer, request: { [key: string]: string | any}) => {
    console.log("New WebSocket connection established\n");
    // TODO: Add authentication and other connection setup here
    ws.send("Connection to websocket successfully established!")
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`)
    console.log("searchParams from url:::: ", searchParams);
    const email: string | null = searchParams?.get("email");
    const dummyUser: UserType = {
        _id: `random_test_id_${email}`,
        username: `test user ${email}`,
        email: email
    }
    const wsService = new WebSocketService(ws, dummyUser);

    ws.on("message", (message: MessageType) => {
        wsService.handleMessage(message);
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed");
    });
})

server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '/ws', `http://${request.headers.host}`);
    if( pathname !== '/ws' ){
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
        return
    }
    wss.handleUpgrade(request, socket, head, (ws: WebSocketServer) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(PORT, () => {
    console.log(`Api and Ws servers are listening on port ${PORT}`);
});

server.on("error", (error: any) => {
    if(error.code === "EADDRINUSE"){
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    }
    console.error("Server error:", error);
})