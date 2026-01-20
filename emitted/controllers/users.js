"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    static async singleUser(req, res, next) {
        res.status(200).json({
            message: "single user endpoint working fine!",
            status: "success",
            data: null
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=users.js.map