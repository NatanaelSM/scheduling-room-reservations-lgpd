import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import loginRoutes from "./routes/login.js";
import reservaRoutes from "./routes/reservas.js";
import bodyParser from "body-parser";
import 'dotenv/config';
import { databaseInit } from "./db.js";
import {connectToDBKeys} from "./db2.js"

const serverInit = () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(cors());

    app.use("/", userRoutes);
    app.use("/", loginRoutes);
    app.use("/", reservaRoutes);

    app.listen(8800, () => {
        console.log("Servidor rodando na porta 8800");
    });
}

const main = async () => {
    try {
        await databaseInit();
        await connectToDBKeys();
        serverInit();
         
    } catch (error) {
        console.error("Erro ao obter dados:", error);
    }
}

main();