import { getDB } from "../db.js";

export const getTermoAtual = async() => {

    const db = await getDB()
    const termos = db.collection("termos_de_uso")

    const termoAtual = await termos.findOne({
        ativo: true
    })

    return termoAtual
}