const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const urldb = "mongodb+srv://edilson:Alunos123@clustercliente.2d5la.mongodb.net/banco?retryWrites=true&w=majority";

mongoose.connect(urldb,{useNewUrlParser:true, useUnifiedTopology:true});

const tabela = new mongoose.Schema({
    nome:{type:String,required:true},
    email:{type:String, required:true,unique:true},
    cpf:{type:String,required:true},
    telefone:String,
    idade:{type:Number,min:16,max:120},
    usuario:{type:String,unique:true},
    senha:String,
    datacadatro:{type:Date,default:Date.now}
});

const Cliente = mongoose.model("tbcliente",tabela);



const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).send({output:"Rota raiz"});
});

app.post("/cadastro",(req,res)=>{
    res.status(201).send({output:"Rota do cadastro",payload:req.body});
});

app.put("/atualizar/:id",(req,res)=>{
    res.status(200).send({output:"Rota do atualizar",payload:req.body});
});

app.delete("/apagar/:id",(req,res)=>{
    res.status(204).send({output:"Rota do apagar"});
});

app.use((req,res)=>{
    res.type("application/json");
    res.status(404).send({output:"Página não localizada"});
});

app.listen(3000,()=>"Servidor online na porta 3000");