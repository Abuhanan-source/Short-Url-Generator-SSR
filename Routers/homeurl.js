import express from "express";
// import { GetUrlClickHistory, RedirectUrl, ShortUrlgenerator } from "../controller/urlgeneratorcontroller.js";
import { HomeUrlPage } from "../controller/Home.contoller.js";
import { UserRoleAuth } from "../middleware/authUser.js";

const homeUrlRouter = express.Router();

homeUrlRouter.get("/",UserRoleAuth(["User"]), HomeUrlPage);

export default homeUrlRouter;
