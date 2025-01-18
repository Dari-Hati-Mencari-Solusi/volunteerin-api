import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initRoutes from "./routes/index.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initRoutes(app);

export default app;