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
    
    Cliente.find((erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao tentar listar",err:erro});

        res.status(200).send({output:"Clientes cadastrados",payload:rs});
    });
});

app.post("/cadastro",(req,res)=>{

    const rs = new Cliente(req.body);
    rs.save().then((dt)=>{
        res.status(201).send({output:"Cadastro realizado!",payload:dt})
    }).catch((erro)=>res.status(400).send({output:`Erro ao tentar cadastrar`, err:erro}))

});

app.put("/atualizar/:id",(req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,{new:true},(erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao atualizar",err:erro});
        res.status(200).send({output:"Dados atualizados",payload:rs});
    });
});

app.delete("/apagar/:id",(req,res)=>{
    Cliente.findByIdAndDelete(req.params.id,(erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao apagar",err:erro});
        res.status(204).send({output:"Apagado com sucesso"});
    });
});

app.use((req,res)=>{
    res.type("application/json");
    res.status(404).send({output:"Página não localizada"});
});

app.listen(3000,()=>"Servidor online na porta 3000");