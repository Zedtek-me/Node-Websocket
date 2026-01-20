import UserService from "../services/user_service";


class UserController{
    public static async singleUser(req, res, next): Promise<any>{
        console.log(`request came in to the single user endpoint!!!\n request origin:: ${req.get("origin")}`)
        return res.status(200).json({
                message: "single user endpoint working fine!",
                status: "success",
                data: null
            })
    }
}


export default UserController;