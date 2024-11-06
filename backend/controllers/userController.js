import bcrypt from "bcrypt";
import { getDB } from "../db.js";
import { getTermoAtual } from "../utils/getTermoAtual.js";

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