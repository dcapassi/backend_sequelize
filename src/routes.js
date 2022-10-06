const express = require('express');
import { Router } from "express";

import UserRegistrationController from "./controllers/UserRegistrationController"
import SessionController from "./controllers/SessionController"
import AuthMiddlware from  "./middlewares/Auth"
import CheckAdm from  "./middlewares/CheckAdm"

const routes = new Router();

//Rotas para o Controlador Sessão
routes.post("/sessao", SessionController.show);

//Rotas para o Controlador CadastrosController
routes.get("/cadastros", AuthMiddlware,CheckAdm,UserRegistrationController.index);
routes.get("/cadastros/:id", AuthMiddlware,CheckAdm,UserRegistrationController.show);
routes.post("/cadastros",AuthMiddlware, CheckAdm,UserRegistrationController.store);
routes.put("/cadastros/:id",AuthMiddlware, CheckAdm, UserRegistrationController.update);
routes.delete("/cadastros/:id", AuthMiddlware,CheckAdm, UserRegistrationController.delete);


module.exports = routes;