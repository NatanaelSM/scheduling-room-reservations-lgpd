import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { getDB } from "../db.js";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const getReservas = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token não fornecido!" });

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });

        const id = decoded.id;

        try {
            const db = await getDB();
            const collection = db.collection("reservas")
            const reservas = await collection.find({ usuario_id: id }).toArray()
            return res.status(200).json(reservas)
        } catch (err) {
            return res.status(500).json({ message: "Erro ao buscar reservas", error: err.message });
        }
    });
};

export const addReserva = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token não fornecido!" });

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });

        console.log(decoded)

        const reservaData = {
            nome_sala: req.body.nome_sala,
            local_sala: req.body.local_sala,
            data_uso: req.body.data_uso,
            hora_inicio_uso: req.body.hora_inicio_uso,
            hora_final_uso: req.body.hora_final_uso,
            responsavel: req.body.responsavel,
            motivo_uso: req.body.motivo_uso,
            info_gerais: req.body.info_gerais,
            convidados: req.body.convidados,
            usuario_id: decoded.id
        };

        try {
            const db = await getDB();
            const collection = db.collection("reservas")
            const result = await collection.insertOne(reservaData)
            return res.status(200).json(result);
        } catch (err) {
            console.error("Erro ao inserir no banco de dados:", err);
            return res.status(500).json(err);
        }
    });
};