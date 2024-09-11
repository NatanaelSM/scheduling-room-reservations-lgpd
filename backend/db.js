import mariadb from "mariadb";
import * as dotenv from 'dotenv';
dotenv.config();

const PASSWORD_DB = process.env.PASSWORD_DB;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: PASSWORD_DB,
    port: 3307,
    connectionLimit: 3 // Limite de conexões no pool
};

let pool;

const createDatabaseIfNotExist = async () => {
    try {
        const conn = await pool.getConnection();
        await conn.query(`CREATE DATABASE IF NOT EXISTS soii`);
        console.log("Banco de dados verificado/criado com sucesso");
    } catch (err) {
        console.error("Erro ao criar o banco de dados:", err);
    }
};

const createTablesIfNotExist = async () => {
    const createUsuarioTableQuery = `
        CREATE TABLE IF NOT EXISTS usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255),
            usuario VARCHAR(255),
            senha VARCHAR(255)
        );
    `;

    const createReservaTableQuery = `
        CREATE TABLE IF NOT EXISTS reserva (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome_sala VARCHAR(250), 
            local_sala VARCHAR(250), 
            data_uso DATE, 
            hora_inicio_uso TIME, 
            hora_final_uso TIME, 
            responsavel VARCHAR(250),
            motivo_uso VARCHAR(450),
            info_gerais VARCHAR(450), 
            convidados VARCHAR(250), 
            usuario_id INT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        );`;

    try {
        const conn = await pool.getConnection();
        await conn.query(createUsuarioTableQuery);
        await conn.query(createReservaTableQuery);
        console.log("Tabelas verificadas/criadas com sucesso");
    } catch (err) {
        console.error("Erro ao criar as tabelas:", err);
    }
};

const initializeDatabase = async () => {
    pool = mariadb.createPool({
        ...dbConfig
    });

    await createDatabaseIfNotExist();
    pool = mariadb.createPool({
        ...dbConfig,
        database: 'soii'
    });

    await createTablesIfNotExist();
};

const init = async () => {
    await initializeDatabase();
};

init().catch(err => console.error("Erro ao inicializar o banco de dados:", err));

export { pool };
