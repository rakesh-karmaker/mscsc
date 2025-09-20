import express from "express";
import upload from "../middlewares/multer.js";
import { login, register } from "../controllers/authController.js";

const authRouter = express.Router();

// Auth Routes
authRouter.post("/register", upload.single("image"), register);
authRouter.post("/login", login);

export default authRouter;
