import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from "dotenv";
import WebSocketService from './services/ws';
import { MessageType } from './types/ws_types/ws';
import connectToDatabase from './configs/database';

config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });
const PORT = process.env.PORT || 3000;

wss.on("connection", (ws: WebSocketServer) => {
    console.log("New WebSocket connection established");
    // TODO: Add authentication and other connection setup here
    /** 
     * Other setups include creating a queue for each connection, attaching it to a direct exchange, etc.
    */
    const wsService = new WebSocketService(ws);

    ws.on("message", (message: {}) => {
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

server.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Api and Ws servers are listening on port ${PORT}`);
});