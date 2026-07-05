import express from "express";
import connectDB from "./connection/dbconnection.js";
import Urlrouter from "./Routers/Url.roues.js";
import HomeUrl from "./Routers/homeurl.js";
import path from "path";
import AuthRouter from "./Routers/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authUser, UserRoleAuth } from "./middleware/authUser.js";
dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json());  
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authUser);

app.use("/auth", AuthRouter);
app.use("/", HomeUrl);
app.use("/url", Urlrouter);

app.set("view engine","ejs")
app.set("views", path.resolve("./views"))

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
