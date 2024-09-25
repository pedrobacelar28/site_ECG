import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import cookieParser from "cookie-parser"; // Corrigido a importação do cookieParser

// Importações das rotas e middlewares
import UserController from "../src/domains/User/controller/userController.ts";
import ECGController from "../src/domains/ECG/controller/ecgController.ts"; 
import errorHandler from "../src/middlewares/errorHandler.ts"; // Certifique-se de que o caminho está correto

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
app.use("/api/users", UserController);
app.use("/api/ecg", ECGController); 

// Middleware de tratamento de erros
app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

export default app;
