import executeQuery from '@/database/db';
import { validaToken } from './users';


export async function Lancar(solicitacao){
try{

const usuario = await validaToken(solicitacao.token)

if(usuario instanceof Error) throw new Error(usuario)
if(usuario.compra!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
if(usuario.ativo!=1)throw new Error('Usuario inativo') 

const result_0 = await executeQuery({
    query: `SELECT * FROM solicitacao where id_solicitacao = ${solicitacao.id_solicitacao}`,
    values: [],
});

if(result_0.length == 0) throw new Error('Solicitação inexistente, atualize a página e tente novamente') // verifica se a solicitação existe, caso ela tenha sido apagada retorna erro


const result = await executeQuery({
    query: `UPDATE solicitacao set id_status = 4 where id_solicitacao = ${solicitacao.id_solicitacao}`,
    values: [],
});

const result_2 = await executeQuery({
    query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
    values: [`A solicitacao ${solicitacao.id_solicitacao} teve seu status alterado para 'Lançado' pelo usuário ${usuario.nome}`, usuario.id_user, solicitacao.id_solicitacao],
});
console.log(result_2)

const result_3 = await executeQuery({
    query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user  ) values(?,?,4,?)`,
    values: [solicitacao.informacao_lancamento, solicitacao.id_solicitacao, usuario.id_user],
});

const result_4 = await executeQuery({
    query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
    values: [`Inserida a informação no status de 'Lançado' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao}  cuja descrição é '${solicitacao.informacao_lancamento}'`, solicitacao.id_solicitacao],
});
     
    const data_compra =  solicitacao.data_compra.split('T')[0]

    const result_5 = await executeQuery({
        query: `INSERT INTO lancamento(id_autorizacao, id_user, data_compra, created_at) values(?, ?, DATE_FORMAT(?, '%Y-%m-%d'), DATE_FORMAT(now(), '%Y-%m-%d'));`,
        values: [solicitacao.id_autorizacao, usuario.id_user, data_compra],
    });
  
    const result_6 = await executeQuery({
        query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
        values: [`Inserida novo 'Lançamento' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao} cujo id do lancamento é ${result_5.insertId}`, solicitacao.id_solicitacao],
    });
    


return 'Adicionado com sucesso!'

}catch(error){
    return error;
}
}



export async function getLancamentos(token){
    try {
          validaToken(token.token);
          const result_0 = await executeQuery({
          query: `select l.*, informacao.descricao as informacao_solicitacao, users.name as usuario_solicitacao
          from (select j.*,
          informacao.descricao as informacao_cotacao,
           users.name as usuario_cotacao
           from (select k.*, 
          informacao.descricao as informacao_autorizacao,
           users.name as usuario_autorizacao
           from (select solicitacao.id_solicitacao, 
          solicitacao.nome, 
          solicitacao.produto, 
          solicitacao.unidade_medida, 
          solicitacao.quantidade, 
          solicitacao.created_at,
          autorizacao.id_autorizacao, 
          cotacao.id_cotacao,
          cotacao.fornecedor, 
          cotacao.valor_unidade,
          cotacao.frete, cotacao.impostos, 
          cotacao.prazo, 
          cotacao.valor_final,
          users.name as usuario_lancamento,
          lancamento.id_lancamento,
          informacao.descricao informacao_lancamento,
          lancamento.data_compra
          from lancamento
          inner join autorizacao on lancamento.id_autorizacao = autorizacao.id_autorizacao
          inner join cotacao on  cotacao.id_cotacao = autorizacao.id_cotacao
          inner join solicitacao on solicitacao.id_solicitacao = cotacao.id_solicitacao
          inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao
          inner join users on users.id_user = informacao.id_user
          where solicitacao.id_status = 4 and informacao.status_informacao = 4)as k
          inner join informacao on informacao.id_solicitacao = k.id_solicitacao
          inner join users on users.id_user = informacao.id_user
          where informacao.status_informacao = 3) as j 
          inner join informacao on informacao.id_solicitacao = j.id_solicitacao
          inner join users on users.id_user = informacao.id_user
          where informacao.status_informacao = 2) as l
          inner join informacao on informacao.id_solicitacao = l.id_solicitacao
          inner join users on users.id_user = informacao.id_user
          where informacao.status_informacao = 1`,
          values: [],
      });

   return result_0;
  } catch ( error ) {
    
      return error;
  }
}