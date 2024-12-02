import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import {getDB} from "../db.js";
import { getDBKeys } from '../db2.js';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const addLogin = async (req, res) => {
    const { usuario, senha } = req.body;

    const db = await getDB();
    const dbKeys = await getDBKeys();
    const usuarios = db.collection("usuarios");
    const chaves = dbKeys.collection("keys");

    try {
        
        const resultUsuario = await usuarios.findOne({ usuario: usuario });

        if (!resultUsuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        
        const chaveData = await chaves.findOne({ usuario_id: resultUsuario._id });
        if (!chaveData) {
            return res
                .status(403)
                .json({ error: "Usuário não autorizado. A chave de criptografia está ausente." });
        }

        
        const isMatch = await bcrypt.compare(senha, resultUsuario.senha);
        if (!isMatch) {
            return res.status(401).json({ error: "Senha inválida." });
        }

        
        const token = jwt.sign({ id: resultUsuario._id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });

    } catch (err) {
        console.error("Erro no banco de dados:", err);
        return res.status(500).json({ error: "Erro no servidor!" });
    }

};
