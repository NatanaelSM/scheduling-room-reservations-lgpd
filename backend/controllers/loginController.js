import bcrypt from 'bcrypt';
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const addLogin = async (req, res) => {
    const { usuario, senha } = req.body;
    const q = "SELECT * FROM usuario WHERE usuario = ?";

    let conn = await pool.getConnection()

    try {
        const result = await conn.query(q, [usuario]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const resultUsuario = result[0];
        const isMatch = await bcrypt.compare(senha, resultUsuario.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        const token = jwt.sign({ id: resultUsuario.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        return res.status(500).json({ error: "Erro no servidor!" });
    } finally {
        if (conn) conn.release();
    }
};
