import Usermodel from "../schema/User.schema.js";
import { getUser } from "../services/auth.js";


export const authUser = (req, res, next) => {
    try {
        const token = req.cookies?.uid;
        req.user = null
        
        if (!token) {
            return next();
        }

        const user = getUser(token);
        
        if(!user){
            return res.status(401).render("login");
        }

        req.user = user;
        return next();
    } catch (error) {
        res.status(500).render("login");
    }
}

export const UserRoleAuth = (role = [])=>{
    try {
        return (req, res, next) => {

            if (!req.user) {
                return res.status(401).render("login");
            }


            if (!role.includes(req.user.Role)) {
                return res.status(403).render("login", { message: "Access denied" });
            }

            return next();
        };
    } catch (error) {
        res.status(500).render("login");
    }
}

