import * as Yup from "yup";
import User from "../models/User";
import { Op } from "sequelize";

/****************************************
Rota para cadastrar Usuários:

Campos obrigatórios:
nome:
email:
senha:
tipo: (1 | 2) onde 1 = admin, 2 = user

*****************************************/
//index
//show
//store
//update
//delete

class UserRegistrationController {
  async index(req, res) {
    /**********************************
     * Mostrar todos os usuarios
     * *******************************/
    const resultado = await User.findAll({
      attributes: ["id", "nome", "email"],
    }).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });
  
    return res.json(resultado);
  } // fim do método index

  async show(req, res) {
    //Apenas permite operação de usuários administradores
    if (res.tipo != "1") {
      return res.status(400).json({ erro: "Usuário deve ser administrador!" });
    }
    /**********************************
     * Validação de entrada
     * *******************************/
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Falha no formato" });
    }

    /**********************************
     * Verificar se o Id existe
     * *******************************/
    const { id } = req.params;
    let validacao = await User.findByPk(id).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });

    if (validacao == null) {
      return res.status(400).json({ error: "Usuário não existe" });
    }
    /**********************************
     * Mostrar usuario
     * *******************************/
    const { nome } = validacao;
    return res.json({ id, nome});
  } // fim do método show

  async store(req, res) {
    /**********************************
     * Validação de entrada
     * *******************************/
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().required(),
      senha: Yup.string().required(),
      tipo: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha no formato" });
    }

    /****************************************************************
     * Garantir que o email seja unico
     * *************************************************************/

    let validacao = await User.findAll({
      where: {
        [Op.or]: [{ email: req.body.email }],
      },
    }).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });
    if (!(validacao == false)) {
      return res.status(400).json({ error: "Email já existente" });
    }

    /**********************************
     * Gravar dados no Banco
     * *******************************/

    const { id, nome, email } = await User.create(req.body).catch(
      (err) => {
        return res.status(400).json({ erro: err.name });
      }
    );
    return res.json({ id, nome, email });
  } // fim do método store

  async update(req, res) {

    /**********************************
     * Validação de entrada
     * *******************************/
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      senha: Yup.string().when("senhaAntiga", (senhaAntiga, field) =>
        senhaAntiga ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    /**********************************
     * Verificar se o Id existe
     * *******************************/
    const { id } = req.params;
    let userExistente = await User.findByPk(id).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });

    if (userExistente == null) {
      return res.status(400).json({ error: "Usuário não existe" });
    }

    /****************************************************************
     * Garantir que o email seja unicos
     * *************************************************************/

    let validacao = await User.findAll({
      where: {
        [Op.or]: [{ email: req.body.email }],
      },
    }).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });
    if (!(validacao == false)) {
      return res.status(400).json({ error: "Email já existente" });
    }

    const { senha, senhaAntiga } = req.body;

    if (!(senha && (await userExistente.checkPassword(senhaAntiga)))) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    /**********************************
     * Update do Usuário
     * *******************************/

    const { nome, email } = req.body;
    await userExistente.update(req.body).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });
    return res.json({ nome, email });
  } // fim do método udpate

  async delete(req, res) {

    /**********************************
     * Validação de entrada
     * *******************************/
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Falha no formato" });
    }
    /**********************************
     * Verificar se o Id existe
     * *******************************/
    const { id } = req.params;
    let userExistente = await User.findByPk(id).catch((err) => {
      return res.status(400).json({ erro: err.name });
    });

    if (userExistente == null) {
      return res.status(400).json({ error: "Usuário não existe" });
    }

    /**********************************
     * Remove o usuário
     * *******************************/
    const respostaRemoção = await userExistente.destroy().catch((err) => {
      return res.status(400).json({ erro: err.name });
    });
    return res.json({ "usuário removido": id });
  } // fim do método udpate
}

export default new UserRegistrationController();
