import { app } from "./config/expressconfig.ts"
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () =>{
    console.log("Servidor hosteado na porta " + process.env.PORT);
});