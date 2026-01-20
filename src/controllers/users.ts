import UserService from "../services/user_service";


class UserController{
    public static async singleUser(req, res, next): Promise<any>{
        res.status(200).json({
            message: "single user endpoint working fine!",
            status: "success",
            data: null
        })
    }
}


export default UserController;