import User from "../models/users";
import { UserType } from "../types/user_types/users";

class UserService{

    public static async fetchUser(): Promise<any>{
        try{
            let user = await User.findOne({});
            if(user)return user.toObject();
            return null;
        }
        catch(err){
            throw err;
        }
    }
}

export default UserService;