import bcrypt from "bcrypt";
import { getDB } from "../db.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;


export const getUsers = async (req, res) => {

    try {
        const db = await getDB();
        const collection = db.collection("usuarios");

        const users = await collection.find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        res.json(err);
    } finally {
        await client.close();
    }
};

export const getUserById = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token não fornecido!" });

    jwt.verify(token,  SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
    
    try {

        const id = decoded.id;

        const db = await getDB();
        const collection = db.collection("usuarios");

        // Busca o usuário pelo `id`
        const user = await collection.findOne({id: id});

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(401).json({ message: "Token inválido ou expirado", error: err });
    }})
};

export const addUser = async (req, res) => {

    const { nome, usuario, data_nascimento, doc_cpf, email, senha } = req.body
    const db = await getDB();
    const usuarios = db.collection("usuarios");
    const termosDeUso = db.collection("termos_de_uso")
    const termoDeUsoAtual = await termosDeUso.findOne({"ativo": true})

    try {
        const hash = await bcrypt.hash(senha, 10);
        await usuarios.insertOne({
            nome: nome,
            usuario: usuario,
            data_nascimento: data_nascimento,
            doc_cpf: doc_cpf,
            email: email,
            senha: hash
        });
        res.status(201).send('Usuário criado com sucesso!');
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        res.status(500).send("Erro no servidor!");
    }

};