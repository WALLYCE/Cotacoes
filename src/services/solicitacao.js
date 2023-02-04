import executeQuery from '@/database/db';
import jwt from 'jsonwebtoken';
import { validaToken } from './users';
const SECRET = process.env.JWT_SECRET;

export async function NovaSolicitacao(solicitacao){
    try {
        const usuario = await validaToken(solicitacao.token);
        if(usuario.ativo!=1)throw new Error('Usuario inativo') 
        if(usuario.ativo == 0)throw new Error('Usuario inativado')
        const result = await executeQuery({
          query: `INSERT INTO solicitacao (nome, created_at, produto, unidade_medida, quantidade, id_status, id_user) values(?,date_format(str_to_date(?, '%d/%m/%Y'), '%Y-%m-%d'),?,?,?,1, ?)`,
          values: [solicitacao.nome, solicitacao.data, solicitacao.produto, solicitacao.unidade, solicitacao.quantidade, usuario.id_user],
      });
        const result_2 = await executeQuery({
            query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user  ) values(?,?,1,?)`,
            values: [solicitacao.informacao, result.insertId, usuario.id_user],
        });

        const result_3 = await executeQuery({
            query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, date_format(str_to_date(?, '%d/%m/%Y'), '%Y-%m-%d'), ?)`,
            values: [`Inserida a solicitacao pelo usuario ${usuario.nome} do Produto ${solicitacao.produto} de unidade ${solicitacao.unidade} na quantidade ${solicitacao.quantidade}`,solicitacao.data, result.insertId],
        });

         const result_4 = await executeQuery({
                query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, date_format(str_to_date(?, '%d/%m/%Y'), '%Y-%m-%d'), ?)`,
                values: [`Inserida a informação no status de solicitação pelo usuario ${usuario.nome} da Solicitação  ${result.insertId}  cuja descrição é '${solicitacao.informacao}'`,solicitacao.data, result.insertId],
            });

           

   return 'Solicitação inserida';

  } catch ( error ) {
      return error;
  }
}


export async function deletarSolicitacao(solicitacao){
    try {
        const usuario = await validaToken(solicitacao.token)
        if(usuario instanceof Error) throw new Error(usuario)
        if(usuario.delete!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
        if(usuario.ativo!=1)throw new Error('Usuario inativo') 
        const result = await executeQuery({
          query: `DELETE FROM solicitacao WHERE solicitacao.id_solicitacao = ${solicitacao.id_solicitacao};`,
          values: [],
      });

   return 'Solicitação inserida';

  } catch ( error ) {
      return error;
  }
}


export async function getTodasSolicitacoes(token){
    try {
        validaToken(token.token)
        const result = await executeQuery({
        query: `Select * from solicitacao inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao where informacao.status_informacao = 1`,
        values: [],
    });
 return result;
} catch ( error ) {
    console.log( error );
    return error;
}


}
export async function getSolicitacoes(token){
    try {
          validaToken(token.token)
          const result = await executeQuery({
          query: `Select solicitacao.*, informacao.id_informacao as id_info_solicitacao,informacao.descricao as descricao_info_solicitacao, users.name as usuario_info_solicitacao from solicitacao inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao inner join users on users.id_user = informacao.id_user where solicitacao.id_status = 1`,
          values: [],
      });
   return result;
  } catch ( error ) {
      console.log( error );
      return error;
  }
}