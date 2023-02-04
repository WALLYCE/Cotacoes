import executeQuery from '@/database/db';
import { validaToken } from './users';


export async function NovaCotacao(solicitacao){
try{

const usuario = await validaToken(solicitacao.token)

if(usuario instanceof Error) throw new Error(usuario)
if(usuario.cotacao!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
if(usuario.ativo!=1)throw new Error('Usuario inativo') 
const result_0 = await executeQuery({
    query: `SELECT * FROM solicitacao where id_solicitacao = ${solicitacao.solicitacao.id_solicitacao}`,
    values: [],
});

if(result_0.length == 0) throw new Error('Solicitação inexistente, atualize a página e tente novamente') // verifica se a solicitação existe, caso ela tenha sido apagada retorna erro


const result = await executeQuery({
    query: `UPDATE solicitacao set id_status = 2 where id_solicitacao = ${solicitacao.solicitacao.id_solicitacao}`,
    values: [],
});

const result_2 = await executeQuery({
    query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
    values: [`A solicitacao ${solicitacao.solicitacao.id_solicitacao} teve seu status alterado para 'Cotado' pelo usuário ${usuario.nome}`, usuario.id_user, solicitacao.solicitacao.id_solicitacao],
});

const result_3 = await executeQuery({
    query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user  ) values(?,?,2,?)`,
    values: [solicitacao.informacao, solicitacao.solicitacao.id_solicitacao, usuario.id_user],
});

const result_4 = await executeQuery({
    query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
    values: [`Inserida a informação no status de 'Cotado' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.solicitacao.id_solicitacao}  cuja descrição é '${solicitacao.informacao}'`, solicitacao.solicitacao.id_solicitacao],
});



solicitacao.cotacoes.map(async (item)=>{
    const result_5 = await executeQuery({
        query: `INSERT INTO cotacao(id_solicitacao, fornecedor, valor_unidade, frete, impostos, valor_final, prazo, id_usuario, created_at) values(?,?, ?, ?, ?, ?, ?, ?, DATE_FORMAT(now(), '%Y-%m-%d'))`,
        values: [solicitacao.solicitacao.id_solicitacao, item.fornecedor, item.valor_unidade, item.frete, item.impostos, item.valor_final, item.prazo, usuario.id_user],
    });
    const result_6 = await executeQuery({
        query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
        values: [`Inserida nova 'Cotação' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.solicitacao.id_solicitacao} cujo id da cotação é ${result_5.insertId}`, solicitacao.solicitacao.id_solicitacao],
    });
    
    
 
})

return 'Adicionado com sucesso!'

}catch(error){
    return error;
}
}



export async function getCotacoes(token){
    try {
          validaToken(token.token);
          const result_0 = await executeQuery({
          query: `Select k.*, informacao.id_informacao as id_info_cotacao, informacao.descricao as descricao_info_cotacao, users.name as usuario_info_cotacao from(Select solicitacao.*, informacao.id_informacao as id_info_solicitacao,informacao.descricao as descricao_info_solicitacao, users.name as usuario_info_solicitacao from solicitacao inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao inner join users on users.id_user = informacao.id_user where solicitacao.id_status = 2 and informacao.status_informacao = 1) as k 
          inner join informacao on informacao.id_solicitacao = k.id_solicitacao inner join users on users.id_user = informacao.id_user where informacao.status_informacao = 2`,
          values: [],
      });


        const resultado_final = await Promise.all(result_0.map(async (item)=>{     
        const result_1 = await executeQuery({
            query: `Select cotacao.id_cotacao, cotacao.id_solicitacao, cotacao.fornecedor, cotacao.valor_unidade, cotacao.frete, cotacao.impostos, cotacao.valor_final, cotacao.id_usuario, cotacao.prazo from cotacao where cotacao.id_solicitacao = ${item.id_solicitacao}`,
            values: [],
        });
        return {solicitacao: item, cotacoes: result_1};
    })   
)

   return resultado_final;
  } catch ( error ) {
      return error;
  }
}




export async function getCotacoesRecusadas(token){
    try {
          validaToken(token.token);
          const result_0 = await executeQuery({
          query: `Select k.*, informacao.id_informacao as id_info_cotacao, informacao.descricao as descricao_info_cotacao, users.name as usuario_info_cotacao from(Select solicitacao.*, informacao.id_informacao as id_info_solicitacao,informacao.descricao as descricao_info_solicitacao, users.name as usuario_info_solicitacao from solicitacao inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao inner join users on users.id_user = informacao.id_user where solicitacao.id_status = 6 and informacao.status_informacao = 1) as k 
          inner join informacao on informacao.id_solicitacao = k.id_solicitacao inner join users on users.id_user = informacao.id_user where informacao.status_informacao = 2`,
          values: [],
      });


        const resultado_final = await Promise.all(result_0.map(async (item)=>{     
        const result_1 = await executeQuery({
            query: `Select cotacao.id_cotacao, cotacao.id_solicitacao, cotacao.fornecedor, cotacao.valor_unidade, cotacao.frete, cotacao.impostos, cotacao.valor_final, cotacao.id_usuario, cotacao.prazo from cotacao where cotacao.id_solicitacao = ${item.id_solicitacao}`,
            values: [],
        });
        return {solicitacao: item, cotacoes: result_1};
    })   
)

   return resultado_final;
  } catch ( error ) {
      return error;
  }
}