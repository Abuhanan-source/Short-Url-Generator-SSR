import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const setUser = (user)=>{
    return jwt.sign({
        _id: user._id,
        email: user.email,
        Role: user.Role,
    }, process.env.secretKey)
}


export const getUser = (token)=>{
    if(!token) return null;

    try {
        return jwt.verify(token, process.env.secretKey);
    } catch (error) {
        return null
    }
}


