import bcrypt from "bcrypt";
import { getDB } from "../db.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import { ObjectId } from 'mongodb';
import { getTermoAtual } from "../utils/getTermoAtual.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const getUsers = async (req, res) => {

    try {
        const db = await getDB();
        const collection = db.collection("usuarios");

        const users = await collection.find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        res.json(err);
    }
};

export const getUserById = async (req, res) => {
    const token = req.headers['authorization'];

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });

        try {
            const id = decoded.id; // Supondo que o ID esteja no token JWT
            const db = await getDB();
            const usuarios = db.collection("usuarios");

            // Converte o `id` para `ObjectId` e busca pelo `_id`
            const user = await usuarios.findOne({ _id: new ObjectId(id) });
            
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "Usuário não encontrado" });
            }
        } catch (err) {
            res.status(500).json({ message: "Erro ao buscar usuário", error: err });
        }
    });
};

export const addUser = async (req, res) => {

    const { nome, usuario, data_nascimento, doc_cpf, email, senha, aceite_termo_opcional_1 } = req.body

    const db = await getDB()

    const usuarios = db.collection("usuarios")
    const aceitacaoTermos = db.collection("aceitacao_termos_de_uso")

    try {

        const hash = await bcrypt.hash(senha, 10);
        const usuarioCriado = await usuarios.insertOne({
            nome: nome,
            usuario: usuario,
            data_nascimento: data_nascimento,
            doc_cpf: doc_cpf,
            email: email,
            senha: hash
        });

        const termoAtual = await getTermoAtual()

        await aceitacaoTermos.insertOne({
            usuario_id: usuarioCriado.insertedId,
            versao_termo: termoAtual.versao,
            aceite_termos_obrigatorios: true,
            aceite_termo_opcional_1: aceite_termo_opcional_1,
            data_aceitacao: new Date()
        })
        
        res.status(201).send('Usuário criado com sucesso!');
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        res.status(500).send("Erro no servidor!");
    }
};


export const deleteUser = async (req, res) => {
    const token = req.headers['authorization'];
    
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' }); 

        try {
            const id = decoded.id;
            const db = await getDB();
            const usuarios = db.collection("usuarios");
            const usuarioApagado = db.collection("id_usuarios_apagados")

            await usuarioApagado.insertOne({ userId: new ObjectId(id), deletedAt: new Date() });
            
            const deleteUserResult = await usuarios.deleteOne({ _id: new ObjectId(id) });
            
            if (deleteUserResult.deletedCount === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            res.status(200).json({ message: "Usuário deletado com sucesso!" });
        } catch (err) {
            res.status(500).json({ message: "Erro no servidor ao deletar usuário", error: err });
        }
    });
};

export const updateUser = async (req, res) => {
    const token = req.headers['authorization'];
    const { usuario, data_nascimento, email, senha } = req.body;

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });

        try {
            const id = decoded.id;
            const db = await getDB();
            const usuarios = db.collection("usuarios");

            const currentUser = await usuarios.findOne({ _id: new ObjectId(id) });

            if (!currentUser) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const updatedFields = {};
            const previousValues = {};

            if (usuario && usuario !== currentUser.usuario) {
                updatedFields.usuario = usuario;
                previousValues.usuario = currentUser.usuario;
            }

            if (data_nascimento && data_nascimento !== currentUser.data_nascimento) {
                updatedFields.data_nascimento = data_nascimento;
                previousValues.data_nascimento = currentUser.data_nascimento;
            }

            if (email && email !== currentUser.email) {
                updatedFields.email = email;
                previousValues.email = currentUser.email;
            }

            let updatedSenha = senha;
            if (senha && senha !== currentUser.senha) {
                const hash = await bcrypt.hash(senha, 10);
                updatedSenha = hash;
                updatedFields.senha = updatedSenha;
                previousValues.senha = currentUser.senha;
            }

            await usuarios.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...(updatedFields.usuario && { usuario: updatedFields.usuario }),
                        ...(updatedFields.data_nascimento && { data_nascimento: updatedFields.data_nascimento }),
                        ...(updatedFields.email && { email: updatedFields.email }),
                        ...(updatedFields.senha && { senha: updatedFields.senha }),
                    }
                }
            );

            const details = {
                updatedFields,
                previousValues
            };

            await logAction(id, "UPDATE", details);

            res.status(200).json({ message: "Usuário atualizado com sucesso!" });

        } catch (err) {
            res.status(500).json({ message: "Erro no servidor ao atualizar usuário", error: err });
        }
    });
};

const logAction = async (userId, action, details = {}) => {
    const db = await getDB();
    const user_logs = db.collection("user_logs");

    try {
        await user_logs.insertOne({
            userId: new ObjectId(userId),
            action: action,
            timestamp: new Date(), // Corrigido para registrar a data atual
            details: details
        });
        console.log("Log criado com sucesso.");
    } catch (error) {
        console.error("Erro ao criar log:", error);
    }
};