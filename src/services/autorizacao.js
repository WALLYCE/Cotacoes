import executeQuery from '@/database/db';
import { validaToken } from './users';



export async function getAutorizados(token){
    try {
          validaToken(token.token)
          const result_0 = await executeQuery({
          query: `select l.*,  informacao.descricao as informacao_autorizacao, users.name as usuario_informacao_autorizacao  from (select j.*, informacao.descricao as informacao_cotacao, users.name as usuario_informacao_cotacao  from (select k.*, informacao.descricao as informacao_solicitacao, users.name as usuario_informacao_solicitacao from (select solicitacao.id_solicitacao, autorizacao.id_autorizacao, solicitacao.nome, solicitacao.produto, solicitacao.unidade_medida, solicitacao.quantidade, solicitacao.created_at, cotacao.fornecedor, cotacao.valor_unidade, cotacao.frete, cotacao.impostos, cotacao.valor_final, cotacao.prazo from autorizacao 
            inner join cotacao on cotacao.id_cotacao = autorizacao.id_cotacao
            inner join solicitacao on solicitacao.id_solicitacao = cotacao.id_solicitacao where solicitacao.id_status = 3) as k
            inner join informacao on informacao.id_solicitacao = k.id_solicitacao 
            inner join users on users.id_user = informacao.id_user where informacao.status_informacao = 1) as j
            inner join informacao on informacao.id_solicitacao = j.id_solicitacao 
            inner join users on users.id_user = informacao.id_user where informacao.status_informacao = 2) as l
            inner join informacao on informacao.id_solicitacao = l.id_solicitacao 
            inner join users on users.id_user = informacao.id_user where informacao.status_informacao = 3`,
          values: [],
      });



   return result_0;
  } catch ( error ) {

      return error;
  }
}

export async function autorizarCotacao(solicitacao){
    try{
    const usuario = await validaToken(solicitacao.token);
    if(usuario instanceof Error) throw new Error(usuario)
    if(usuario.autorizacao!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
    if(usuario.ativo!=1)throw new Error('Usuario inativo') 
    const result = await executeQuery({
        query: `UPDATE solicitacao set id_status = 3 where id_solicitacao = ${solicitacao.id_solicitacao}`,
        values: [],
    });
   
 
    const result_3 = await executeQuery({
        query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user  ) values(?,?,3,?)`,
        values: [solicitacao.informacao_autorizacao, solicitacao.id_solicitacao, usuario.id_user],
    });
    
    const result_4 = await executeQuery({
        query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
        values: [`Inserida a informação no status de 'Autorizado' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao} cuja descrição é '${solicitacao.informacao_autorizacao}'`, solicitacao.id_solicitacao],
    });


    solicitacao.cotacoes.map(async (item)=>{
        if(item.autorizado == 'true'){
            const result_5 = await executeQuery({
                query: `INSERT INTO autorizacao(id_cotacao,id_usuario, created_at ) values(?, ?, DATE_FORMAT(now(), '%Y-%m-%d'))`,
                values: [item.id_cotacao, usuario.id_user],
            });
        }
    })

   return 'Operação realizada com sucesso';
  } catch ( error ) {

      return error;
  }
}



export async function recusarCotacao(solicitacao){
    try{
    const usuario = await validaToken(solicitacao.token);
    if(usuario instanceof Error) throw new Error(usuario)
    if(usuario.autorizacao!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
    const result = await executeQuery({
        query: `UPDATE solicitacao set id_status = 6 where id_solicitacao = ${solicitacao.id_solicitacao}`,
        values: [],
    });
   
    const result_2 = await executeQuery({
        query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
        values: [`A solicitacao ${solicitacao.id_solicitacao} teve seu status alterado para 'Não autorizado' pelo usuário ${usuario.nome}`, usuario.id_user, solicitacao.id_solicitacao],
    });

    const result_3 = await executeQuery({
        query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user) values(?,?,6,?)`,
        values: [solicitacao.informacao_autorizacao, solicitacao.id_solicitacao, usuario.id_user],
    });
    
    const result_4 = await executeQuery({
        query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
        values: [`Inserida a informação no status de 'Não autorizado' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao}  cuja descrição é '${solicitacao.informacao_autorizacao}'`, solicitacao.id_solicitacao],
    });

   return 'Operação realizada com sucesso';
  } catch ( error ) {

      return error;
  }
}