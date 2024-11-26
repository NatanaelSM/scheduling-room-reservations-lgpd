import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();

const usuarioCluster = process.env.USER_MONGODB_CLUSTER;
const senhaUsuarioCluster = process.env.PASSWORD_USER_MONGODB_CLUSTER;
const uri = `mongodb+srv://${usuarioCluster}:${senhaUsuarioCluster}@cluster-lgpd.qclwz.mongodb.net/?retryWrites=true&w=majority&appName=cluster-lgpd`;
let database;

export const client = new MongoClient(uri);

export const databaseInit = async () => {
    try {
        await client.connect();
        database = client.db("db_lgpd");
        console.log("Conexão com MongoDB estabelecida.");
    } catch (error) {
        console.error("Erro ao conectar no MongoDB:", error);
        throw error;
    }
}

export const getDB = async () => {
    
    if (!database) {
        throw new Error("A conexão com o banco de dados não foi estabelecida.");
    }
    return database;
}


