"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const router = new express_1.Router();
router.use("/api/v1", users_1.default);
router.all("*all", (req, res) => {
    res.status(404).json({
        message: "page not found",
        data: {},
        status: "error"
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map