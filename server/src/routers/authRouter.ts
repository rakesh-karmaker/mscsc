import express from "express";
import upload from "../middlewares/multer.js";
import { login, register, verifyUser } from "../controllers/authController.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// Auth Routes
authRouter.post("/register", upload.single("image"), register);
authRouter.post("/login", login);
authRouter.get("/verify", isAuthorized, verifyUser);

export default authRouter;
