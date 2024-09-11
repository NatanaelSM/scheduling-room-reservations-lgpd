import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import reservaRoutes from "./routes/reservas.js";
import loginRoutes from "./routes/login.js";
import bodyParser from "body-parser";
import 'dotenv/config';


const app = express();

app.use(bodyParser.json());
app.use(express.json())
app.use(cors())

app.use("/", userRoutes);
app.use("/", reservaRoutes);
app.use("/", loginRoutes);

app.listen(8800)