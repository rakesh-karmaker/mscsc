import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(errorHandler);
app.use(
  cors({
    origin: [config.clientUrl],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

export default app;
