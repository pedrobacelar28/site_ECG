import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
/*import UserRouter from "../src/domains/User/controllers";
import ECGRouter from "../src/domains/ECG/controllers"; // Atualização para incluir o ECGRouter
import errorHandler from '../src/middlewares/erroHandler';

import cookieParser = require("cookie-parser");*/

dotenv.config();

export const app: Express = express();
const options: CorsOptions = {
	credentials: true,
	origin: process.env.APP_URL, // Link do front-end que estará em execução
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

// Rotas
app.use("/api/users", UserRouter);
app.use("/api/ecg", ECGRouter); // Atualização para incluir o ECGRouter

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
