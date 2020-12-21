const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const sequelize = require("sequelize");

let accounts = require("./models").accounts;

app.use(logger('dev'));

// variables de entorno
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Helpers

// Trae todos los usuarios
const getAllUsers = async () =>{
    return await accounts.findAll();
}

// Guarda un usuario
const createUser = async ({username, password}) => {
    return await accounts.create({username, password});
}

// Traer un usuario
const getUser = async obj =>{
    return await accounts.findOne({
        where: obj
    });
};

//Comprobar Token
const accesToken = (token) =>{
    if (token === "123456"){
        return "Llegue con ruta protegina"
    }else {
        return "No esta autorizado"
    }
};


// rutas y funciones
app.get("/", function(req, res) {
    getAllUsers().then(users => res.json(users));
});

app.post("/", function(req, res) {
    const {username, password} = req.body;
    createUser({username, password}).then(user => res.json(user));
});

app.post("/login", async function(req, res){
    const {username, password} = req.body;
    if (username && password){
        let user = await getUser({username:username})
        if (!user){
            res.json("problema con el usuario");
        } 
        if (user.password === password){
            let token = "123456";
            res.json(token);
        }else {
            res.json("password incorrecto")
        }
    }else {
        res.json("error logueo");
    }
})

app.post("/protected", function(res, req){
    let token = req.body.token;
    if (token){
        let result = accesToken(token);
        res.json(result);
    }else{
        res.json("no existe token");
    }
});

// verificacion ambiente
if(process.env.NODE_ENV === "production"){
    port = process.env.PORT_PROD;
} else {
    port = process.env.PORT_DEV;
};

// express
app.listen(port, function(){
    console.log("Servidor Activo", port, process.env.NODE_ENV);
});