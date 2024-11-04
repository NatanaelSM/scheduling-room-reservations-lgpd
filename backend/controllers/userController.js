import bcrypt from "bcrypt";
import { getDB } from "../db.js";

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

    try {
        await client.connect();
        const db = await getDB();
        const collection = db.collection("usuarios");

        const user = await collection.findOne({ _id: new ObjectId(id) });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    } catch (err) {
        res.json(err);
    } finally {
        await client.close();
    }
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