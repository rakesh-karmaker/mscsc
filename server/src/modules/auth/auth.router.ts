import express from "express";
import upload from "../../shared/middlewares/multer.js";
import { login, register, verifyUser } from "./auth.controller.js";
import { isAuthorized } from "../../shared/middlewares/auth-middleware.js";

const authRouter = express.Router();

// Auth Routes
authRouter.post("/register", upload.single("image"), register);
authRouter.post("/login", login);
authRouter.get("/verify", isAuthorized, verifyUser);

export default authRouter;
