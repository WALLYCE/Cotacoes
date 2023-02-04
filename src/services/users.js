import executeQuery from '@/database/db';
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET;

export async function Login(user){
    try {
        const result = await executeQuery({
          query: 'SELECT * FROM users WHERE email = ? and password = ?',
          values: [user.email, user.password],
      });
        if(result.length == 0) throw new Error('Dados inválidos')
        else{
          console.log(result)
          if(result[0].ativo == 0)throw new Error('Usuario inativo')
          const token = createToken(result[0]);
          return {
                  token: token,
                  nome: result[0].name,
                  email: result[0].email,
                  cotacao: result[0].cotacao,
                  compra: result[0].compra,
                  autorizacao: result[0].autorizacao,
                  recebimento: result[0].recebimento,
                  delete: result[0].delete,
                  admin: result[0].admin,
                  ativo: result[0].ativo
                };
              }
  } catch ( error ) {
      return new Error(error.message);
  }
 
}




function createToken(user){
    return jwt.sign({id_user: user.id_user,ativo: user.ativo, email: user.email, nome: user.name,cotacao: user.cotacao,autorizacao: user.autorizacao,compra: user.compra, recebimento: user.recebimento, delete: user.delete, admin: user.admin }, SECRET)
  }
  
export function readToken(token){
    try{
      return jwt.verify(token, SECRET);
    }catch (err){
      throw new Error('Token inválido')
    }
  }

export function validaToken(token){
  return readToken(token);
}

export async function getUsers(dados){
  try {
     console.log(dados)
      const usuario = await validaToken(dados.token);
      if(usuario instanceof Error) throw new Error(usuario)
      if(usuario.admin!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
    const result = await executeQuery({
      query: 'SELECT * FROM users',
      values: [],
  });
  
      return result;
          
} catch ( error ) {
  return new Error(error.message);
}
}

export async function cadastrarUsuario(dados){
  try {
      const usuario = await validaToken(dados.token);
      if(usuario instanceof Error) throw new Error(usuario)
      if(usuario.admin!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
      const result = await executeQuery({
        query: 'SELECT * FROM users WHERE email = ?',
        values: [dados.usuario.email],
    });

    if(result.length!=0){
      throw new Error('Usuario com email já cadastrado\nCaso necessite ative-o no painel de contas');
    } 
    
    if(dados.usuario.cotar == true){
      dados.usuario.cotar=1;
    }else{
      dados.usuario.cotar=0;
    }
    if(dados.usuario.autorizar== true){
      dados.usuario.autorizar=1;
    }else{
      dados.usuario.autorizar=0;
    }
    if(dados.usuario.lancar== true){
      dados.usuario.lancar=1;
    }else{
      dados.usuario.lancar=0;
    }
    if(dados.usuario.receber== true){
      dados.usuario.receber=1;
    }else{
      dados.usuario.receber=0;
    }


    const result_1 = await executeQuery({
        query: 'INSERT users (name, email, password, cotacao, autorizacao, recebimento, compra, ativo) values (?,?,?,?,?,?,?, 1) ',
        values: [dados.usuario.name, dados.usuario.email, dados.usuario.password, dados.usuario.cotar, dados.usuario.autorizar, dados.usuario.receber, dados.usuario.lancar],
    });


         

 return 'Usuario adicionado';

} catch ( error ) {
    return error;
}
}


export async function updateUser(dados){
  try {
      const user = await validaToken(dados.token);
      if(user instanceof Error) throw new Error(user)
      if(user.admin!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
    if(dados.usuario.cotacao == true){
      dados.usuario.cotacao =1;
    }else{
      dados.usuario.cotacao=0;
    }
    if(dados.usuario.autorizacao== true){
      dados.usuario.autorizacao=1;
    }else{
      dados.usuario.autorizacao=0;
    }
    if(dados.usuario.compra== true){
      dados.usuario.compra=1;
    }else{
      dados.usuario.compra=0;
    }
    if(dados.usuario.recebimento== true){
      dados.usuario.recebimento=1;
    }else{
      dados.usuario.recebimento=0;
    }
    if(dados.usuario.ativo == true){
      dados.usuario.ativo=1;
    }else{
      dados.usuario.ativo=0;
    }


    const result_1 = await executeQuery({
        query: `UPDATE users SET password = ?, cotacao = ?, autorizacao = ?, compra = ?, recebimento = ?, ativo = ? where users.id_user = ${dados.usuario.id_user}`,
        values: [dados.usuario.password, dados.usuario.cotacao, dados.usuario.autorizacao, dados.usuario.compra, dados.usuario.recebimento, dados.usuario.ativo],
    });


         

 return 'Dados do usuario alterados';

} catch ( error ) {
    return error;
}
}
