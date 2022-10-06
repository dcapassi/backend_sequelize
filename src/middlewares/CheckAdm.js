import tipoUsuario from "../configs/general";

export default async (req, res, next) => {

  if (res.tipo != tipoUsuario.admin_type) {
    return res.status(400).json({ erro: "Usuário deve ser administrador!" });}

  next();
};