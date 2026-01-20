"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../controllers/users"));
const router = new express_1.Router();
router.get("/user/:id", users_1.default.singleUser);
exports.default = router;
//# sourceMappingURL=users.js.map