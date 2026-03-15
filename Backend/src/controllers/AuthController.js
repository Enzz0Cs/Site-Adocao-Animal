import UsuarioModel from "../models/UsuarioModel.js";

class AuthController {

    static async login(req,res){

        const {email,senha} = req.body;

        const usuario = await UsuarioModel.buscarPorEmail(email);

        if(!usuario){
            return res.status(401).json({error:"Usuário não encontrado"});
        }

        if(usuario.senha !== senha){
            return res.status(401).json({error:"Senha incorreta"});
        }

        res.json({
            id:usuario.id,
            nome:usuario.nome,
            nivel:usuario.nivel_acesso
        });

    }

}

export default AuthController;