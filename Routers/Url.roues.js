import express from "express";
import { GetUrlClickHistory, RedirectUrl, ShortUrlgenerator } from "../controller/urlgeneratorcontroller.js";
import { UserRoleAuth } from "../middleware/authUser.js";

const Urlrouter = express.Router();

Urlrouter.post("/generateURl",UserRoleAuth(["User"]), ShortUrlgenerator);
Urlrouter.get("/history",UserRoleAuth(["User"]), GetUrlClickHistory);
Urlrouter.get("/:shortUrlId", RedirectUrl);

export default Urlrouter;
