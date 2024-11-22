import 'dotenv/config';
import conectarAoBanco from "../config/dbconfig.js"
import { ObjectId } from "mongodb";

const conexaoDb = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts(){
    const db = conexaoDb.db("imerssao-instabyte");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

export async function criarPost(novoPost){
    const db = conexaoDb.db("imerssao-instabyte");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
    const db = conexaoDb.db("imerssao-instabyte");
    const colecao = db.collection("posts");

    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, { $set: novoPost});
}


