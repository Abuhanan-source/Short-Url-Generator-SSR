import express from "express";
import { Loginpage, Loginuser, OtpChecker, OTppage, SignOut, SignUppage, SignUpUser } from "../controller/User.contoller.js";

const AuthRouter = express.Router();

AuthRouter.get("/Usersignup",  SignUppage);
AuthRouter.get("/Userlogin",  Loginpage);
AuthRouter.get("/OtpPage",  OTppage);
AuthRouter.post("/signup",  SignUpUser);
AuthRouter.post("/login",  Loginuser);
AuthRouter.get("/signout",  SignOut);
AuthRouter.post("/otpcheck",  OtpChecker);

export default AuthRouter;
