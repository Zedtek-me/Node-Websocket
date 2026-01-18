"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
class UserService {
    static async fetchUser() {
        try {
            let user = await users_1.default.findOne({});
            if (user)
                return user.toObject();
            return null;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user_service.js.map