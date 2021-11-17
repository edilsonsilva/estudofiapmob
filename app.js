const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const settings = require("./config/settings");
const Cliente = require("./model/cliente");
const autentica = require("./middleware/autentica");
const bcrypt = require("bcrypt");


mongoose.connect(settings.dbpath,{useNewUrlParser:true, useUnifiedTopology:true});

const confCors = {
    origin:"*",
    optionSuccessStatus:200
}

const app = express();

app.use(express.json());


app.post("/login",(req,res)=>{
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    Cliente.findOne({usuario:usuario},(err,rs)=>{
        if(!rs)return res.status(404).send({output:"Usuário não existe"});
        bcrypt.compare(senha,rs.senha,(err,dt)=>{
            if(!dt)return res.status(400).send({output:"Senha incorreta"});
            const token = createToken(rs._id,rs.usuario,rs.nome);
            res.status(200).send({output:"Usuáio logado",token:token})
        })
    })

})


app.get("/",cors(confCors),(req,res)=>{
    
    Cliente.find((erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao tentar listar",err:erro});

        res.status(200).send({output:"Clientes cadastrados",payload:rs});
    });
});

app.post("/cadastro",cors(confCors),(req,res)=>{

    const rs = new Cliente(req.body);
    rs.save().then((dt)=>{
        res.status(201).send({output:"Cadastro realizado!",payload:dt})
    }).catch((erro)=>res.status(400).send({output:`Erro ao tentar cadastrar`, err:erro}))

});

app.put("/atualizar/:id",cors(confCors),autentica,(req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,{new:true},(erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao atualizar",err:erro});
        res.status(200).send({output:"Dados atualizados",payload:rs});
    });
});

app.delete("/apagar/:id",cors(confCors),(req,res)=>{
    Cliente.findByIdAndDelete(req.params.id,(erro,rs)=>{
        if(erro) return res.status(400).send({output:"Erro ao apagar",err:erro});
        res.status(204).send({output:"Apagado com sucesso"});
    });
});

app.use((req,res)=>{
    res.type("application/json");
    res.status(404).send({output:"Página não localizada"});
});


const createToken = (id,usuario,nome)=>{
    return jwt.sign({id:id, usuario:usuario,nome:nome},settings.jwt_key,{expiresIn:settings.jwt_expires})
}




app.listen(3000,()=>"Servidor online na porta 3000");