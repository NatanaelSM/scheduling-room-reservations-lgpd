import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const usuarioCluster = process.env.USER_MONGODB_CLUSTER;
const senhaUsuarioCluster = process.env.PASSWORD_USER_MONGODB_CLUSTER;
const uri = `mongodb+srv://${usuarioCluster}:${senhaUsuarioCluster}@cluster-lgpd.qclwz.mongodb.net/?retryWrites=true&w=majority&appName=cluster-lgpd`;


const client = new MongoClient(uri);

let dbKeys;

export const connectToDBKeys = async () => {
    if (!dbKeys) {
        try {
            await client.connect();
            dbKeys = client.db("db_keys");
            console.log("Conexão estabelecida com o banco de chaves.");
        } catch (err) {
            console.error("Erro ao conectar ao banco de chaves:", err);
            throw err;
        }
    }
    return dbKeys;
};

export const getDBKeys = async () => {
    if (!dbKeys) {
        throw new Error("Banco de chaves não conectado. Chame connectToDBKeys primeiro.");
    }
    return dbKeys;
};