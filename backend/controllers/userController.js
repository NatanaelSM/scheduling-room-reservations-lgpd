import bcrypt from "bcrypt";
import crypto from "crypto";
import { getDB } from "../db.js";
import { getDBKeys } from "../db2.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import { ObjectId } from 'mongodb';
import { getTermoAtual } from "../utils/getTermoAtual.js";
import { exec } from "child_process";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Criptografia

const algoritmo = 'aes-256-cbc';

const gerarChave = () => crypto.randomBytes(32);

// Criptografa um texto com uma chave e IV
const criptografar = (texto, chave) => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algoritmo, chave, iv);
    const textoCriptografado = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
    return { textoCriptografado, iv };
};

// Descriptografa um texto com uma chave e IV
const descriptografar = (textoCriptografado, chave, iv) => {
    const decipher = crypto.createDecipheriv(algoritmo, chave, iv);
    const textoDescriptografado = Buffer.concat([decipher.update(textoCriptografado), decipher.final()]);
    return textoDescriptografado.toString('utf8');
};


export const addUser = async (req, res) => {
    const { nome, usuario, data_nascimento, doc_cpf, email, senha, aceite_termo_opcional_1 } = req.body;

    const db = await getDB();
    const dbKeys = await getDBKeys();
    const usuarios = db.collection("usuarios");
    const aceitacaoTermos = db.collection("aceitacao_termos_de_uso");
    const chaves = dbKeys.collection("keys")

    try {
        // Criação da chave secreta
        const secretKey = gerarChave();
        const privateKeyString = secretKey.toString('base64');

        // Criptografar os campos sensíveis
        const camposCriptografados = {
            nome: criptografar(nome, secretKey),
            data_nascimento: criptografar(data_nascimento, secretKey),
            doc_cpf: criptografar(doc_cpf, secretKey),
            email: criptografar(email, secretKey)
        };

        // Hash da senha
        const hash = await bcrypt.hash(senha, 10);

        // Salvar chave secreta no banco
        const usuarioCriado = await usuarios.insertOne({
            nome: camposCriptografados.nome.textoCriptografado.toString('base64'),
            nome_iv: camposCriptografados.nome.iv.toString('base64'),
            data_nascimento: camposCriptografados.data_nascimento.textoCriptografado.toString('base64'),
            data_nascimento_iv: camposCriptografados.data_nascimento.iv.toString('base64'),
            doc_cpf: camposCriptografados.doc_cpf.textoCriptografado.toString('base64'),
            doc_cpf_iv: camposCriptografados.doc_cpf.iv.toString('base64'),
            email: camposCriptografados.email.textoCriptografado.toString('base64'),
            email_iv: camposCriptografados.email.iv.toString('base64'),
            usuario,
            senha: hash
        });

        await chaves.insertOne({
            usuario_id: usuarioCriado.insertedId,
            chave: privateKeyString,
            criadoEm: new Date()
        });

        const termoAtual = await getTermoAtual();

        await aceitacaoTermos.insertOne({
            usuario_id: usuarioCriado.insertedId,
            versao_termo: termoAtual.versao,
            aceite_termos_obrigatorios: true,
            aceite_termo_opcional_1,
            data_aceitacao: new Date()
        });

        res.status(201).send('Usuário criado com sucesso!');
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        res.status(500).send("Erro no servidor!");
    }
};

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
            const id = decoded.id;
            const db = await getDB();
            const dbKeys = await getDBKeys();
            const usuarios = db.collection("usuarios");
            const chaves = dbKeys.collection("keys");

            const user = await usuarios.findOne({ _id: new ObjectId(id) });

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Recuperar a chave secreta do banco
            const chaveData = await chaves.findOne({ usuario_id: new ObjectId(id) });

            if (!chaveData) {
                return res.status(404).json({ message: "Chave de criptografia não encontrada" });
            }

            const secretKey = Buffer.from(chaveData.chave, 'base64');

            // Descriptografar os campos sensíveis
            const nome = descriptografar(Buffer.from(user.nome, 'base64'), secretKey, Buffer.from(user.nome_iv, 'base64'));
            const data_nascimento = descriptografar(Buffer.from(user.data_nascimento, 'base64'), secretKey, Buffer.from(user.data_nascimento_iv, 'base64'));
            const doc_cpf = descriptografar(Buffer.from(user.doc_cpf, 'base64'), secretKey, Buffer.from(user.doc_cpf_iv, 'base64'));
            const email = descriptografar(Buffer.from(user.email, 'base64'), secretKey, Buffer.from(user.email_iv, 'base64'));

            res.status(200).json({
                ...user,
                nome,
                data_nascimento,
                doc_cpf,
                email
            });
        } catch (err) {
            res.status(500).json({ message: "Erro ao buscar usuário", error: err });
        }
    });
};

const backupDatabase = () => {
  return new Promise((resolve, reject) => {
    const backupPath = "C:\\Users\\Pedro\\Documents\\ADS 5º semestre\\Segurança da informação\\scheduling-room-reservations-lgpd\\backend\\backups";
    const command = `mongodump --uri "mongodb+srv://admin:admin123456@cluster-lgpd.qclwz.mongodb.net/" --out  "${backupPath}"`;
    console.log("Iniciando backup com o comando:", command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Erro ao fazer backup:", stderr);
        return reject(error);
      }
      console.log("Backup realizado com sucesso:", stdout);
      resolve();
    });
  });
};


export const deleteUser = async (req, res) => {
    const token = req.headers['authorization'];
    
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
  
      try {
        const id = decoded.id;
        const db = await getDB();
        const dbKeys = await getDBKeys();
        const usuarios = db.collection("usuarios");
        const reservas = db.collection("reservas");
        const chaves = dbKeys.collection("keys");
    // const usuarioApagado = db.collection("id_usuarios_apagados");
  
        const currentUser = await usuarios.findOne({ _id: new ObjectId(id) });
  
        if (!currentUser) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        const deleteUserResult = await usuarios.deleteOne({ _id: new ObjectId(id) });

        await reservas.deleteOne({ _id: id });
        
       // await usuarioApagado.insertOne({ userId: new ObjectId(id), deletedAt: new Date() });

        if (deleteUserResult.deletedCount === 0) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

         // Excluir a chave do banco de chaves
         const resultadoChave = await chaves.deleteOne({ usuario_id: new ObjectId(id) });
         if (resultadoChave.deletedCount === 0) {
             console.warn(`Chave para o usuário ${id} não encontrada no bd_keys.`);
         }

       // console.log("Executando backup do banco de dados...");
       // await backupDatabase();
       // console.log("Backup finalizado com sucesso!");
        
  
        res.status(200).json({ message: "Usuário e chave deletados com sucesso!" });
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

            let updatedFields = {};
            let previousValues = {};

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
            timestamp: new Date(),
            details: details
        });
        console.log("Log criado com sucesso.");
    } catch (error) {
        console.error("Erro ao criar log:", error);
    }
};