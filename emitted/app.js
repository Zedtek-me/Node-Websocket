"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const ws_2 = __importDefault(require("./services/ws"));
const database_1 = __importDefault(require("./configs/database"));
const settings = __importStar(require("./settings"));
const index_1 = __importDefault(require("./routes/index"));
(0, database_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(index_1.default);
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ noServer: true });
const PORT = settings.PORT || 4000;
wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");
    // TODO: Add authentication and other connection setup here
    /**
     * Other setups include creating a queue for each connection, attaching it to a direct exchange, etc.
    */
    const wsService = new ws_2.default(ws);
    ws.on("message", (message) => {
        wsService.handleMessage(message);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed");
    });
});
server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '/ws', `http://${request.headers.host}`);
    if (pathname !== '/ws') {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
server.listen(PORT, () => {
    console.log(`Api and Ws servers are listening on port ${PORT}`);
});
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    }
    console.error("Server error:", error);
});
//# sourceMappingURL=app.js.map