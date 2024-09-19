import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {

    const q = "SELECT * FROM usuario";
    let conn = await pool.getConnection()

    try {
        const rows = await conn.query(q);
        res.status(200).json(rows);
    } catch (err) {
        res.json(err);
    }finally {
        if (conn) conn.release();
    }
};

export const getUserById = async (req, res) => {

    const q = "SELECT * FROM usuario WHERE id = ?";
    const id = req.params.id;
    let conn = await pool.getConnection()

    try {
        const rows = await conn.query(q, [id]);
        res.status(200).json(rows);
    } catch (err) {
        res.json(err);
    }finally {
        if (conn) conn.release();
    }
};

export const addUser = async (req, res) => {

    const { nome, usuario, senha } = req.body;
    const q = "INSERT INTO usuario(`nome`, `senha`, `usuario`) VALUES (?, ?, ?)";
    let conn = await pool.getConnection()

    try {
        const hash = await bcrypt.hash(senha, 10);
        await conn.query(q, [nome, hash, usuario]);
        res.status(201).send('Usuário criado com sucesso!');
    } catch (err) {
        console.error("Erro no banco de dados:", err);
        res.status(500).send("Erro no servidor!");
    }finally {
        if (conn) conn.release();
    }
};