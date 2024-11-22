import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js"
import gerarDescricaoComGemini from "../services/germiniService.js"
import fs from "fs"

export async function listarPosts (req, res) {
        const postsDb = await getTodosPosts();
        res.status(200).json(postsDb);
};

export async function adicionarPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erro){
        console.error(erro.message);
        res.status(500).json({"erro": "Falha na criação do Post"})
    }
};

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imagemUrl: req.file.originalname,
        alt: ""
    }
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch (erro){
        console.error(erro.message);
        res.status(500).json({"erro": "Falha na criação do Post"})
    }
};

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricaoGermini = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imagem_url: urlImagem,
            descricao: descricaoGermini,
            alt: req.body.alt
        };

        const postAtualizado = await atualizarPost(id, post);
        res.status(200).json(postAtualizado);
    } catch (erro){
        console.error(erro.message);
        res.status(500).json({"erro": "Falha na criação do Post"})
    }
};