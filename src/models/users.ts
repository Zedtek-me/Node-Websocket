import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false,
        default: null
    }
});

const User = mongoose.model("User", UserSchema);

export default User;