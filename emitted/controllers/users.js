"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    static async singleUser(req, res, next) {
        console.log(`request came in to the single user endpoint!!!\n request origin:: ${req.get("origin")}`);
        return res.status(200).json({
            message: "single user endpoint working fine!",
            status: "success",
            data: null
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=users.js.map