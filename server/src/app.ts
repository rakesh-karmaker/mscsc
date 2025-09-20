import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import config from "./config/config.js";

const app = express();

// Configure CORS to allow only requests from the specified origin
const corsOptions = {
  origin: config.clientUrl || config.serverUrl,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(errorHandler);

export default app;
