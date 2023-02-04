import executeQuery from '@/database/db';
import { validaToken } from './users';



export async function getEntregues(token){
    try {
          validaToken(token.token)
          const result_0 = await executeQuery({
          query: `select m.*, informacao.descricao as informacao_solicitacao, users.name as usuario_solicitacao from (select l.*, informacao.descricao as informacao_cotacao, users.name as usuario_cotacao
            from (select j.*,
            informacao.descricao as informacao_autorizacao,
             users.name as usuario_autorizacao
             from (select k.*, 
            informacao.descricao as informacao_lancamento,
             users.name as usuario_lancamento
             from (select solicitacao.id_solicitacao, 
            solicitacao.nome, 
            solicitacao.produto, 
            solicitacao.unidade_medida, 
            solicitacao.quantidade, 
            solicitacao.created_at as created_at_solicitacao,
            autorizacao.id_autorizacao, 
            autorizacao.created_at as created_at_autorizacao,
            cotacao.id_cotacao,
            cotacao.fornecedor, 
            cotacao.valor_unidade,
            cotacao.frete, 
            cotacao.impostos, 
            cotacao.prazo, 
            cotacao.valor_final,
            cotacao.created_at as created_at_cotacao,
            entrega.id_entrega,
            users.name as usuario_entrega,
            lancamento.id_lancamento,
            informacao.descricao as informacao_entrega,
            lancamento.created_at as created_at_lancamento,
            lancamento.data_compra,
            entrega.data_entrega,
            entrega.created_at as created_at_entrega
            from entrega
            inner join lancamento on lancamento.id_lancamento = entrega.id_lancamento
            inner join autorizacao on lancamento.id_autorizacao = autorizacao.id_autorizacao
            inner join cotacao on  cotacao.id_cotacao = autorizacao.id_cotacao
            inner join solicitacao on solicitacao.id_solicitacao = cotacao.id_solicitacao
            inner join informacao on informacao.id_solicitacao = solicitacao.id_solicitacao
            inner join users on users.id_user = informacao.id_user
            where solicitacao.id_status = 5 and informacao.status_informacao = 5)as k
            inner join informacao on informacao.id_solicitacao = k.id_solicitacao
            inner join users on users.id_user = informacao.id_user
            where informacao.status_informacao = 4) as j 
            inner join informacao on informacao.id_solicitacao = j.id_solicitacao
            inner join users on users.id_user = informacao.id_user
            where informacao.status_informacao = 3) as l
            inner join informacao on informacao.id_solicitacao = l.id_solicitacao
            inner join users on users.id_user = informacao.id_user
            where informacao.status_informacao = 2) as m
        inner join informacao on informacao.id_solicitacao = m.id_solicitacao
       inner join users on users.id_user = informacao.id_user 
      where informacao.status_informacao = 1 order by m.created_at_entrega`,
          values: [],
      });


   return result_0;
  } catch ( error ) {
      return error;
  }
}

export async function adicionarEntrega(solicitacao){
    try{

        const usuario = await validaToken(solicitacao.token)
        
        if(usuario instanceof Error) throw new Error(usuario)
        if(usuario.recebimento!=1)throw new Error('Você não está autorizado a realizar essa operação') // verifica o token, se for inválida cria um erro
        if(usuario.ativo!=1)throw new Error('Usuario inativo') 
        const result_0 = await executeQuery({
            query: `SELECT * FROM solicitacao where id_solicitacao = ${solicitacao.id_solicitacao}`,
            values: [],
        });
        
        if(result_0.length == 0) throw new Error('Solicitação inexistente, atualize a página e tente novamente') // verifica se a solicitação existe, caso ela tenha sido apagada retorna erro
        
        
        const result = await executeQuery({
            query: `UPDATE solicitacao SET id_status = 5 where solicitacao.id_solicitacao = ?`,
            values: [solicitacao.id_solicitacao],
        });
        
        const result_2 = await executeQuery({
            query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
            values: [`A solicitacao ${solicitacao.id_solicitacao} teve seu status alterado para 'Recebido' pelo usuário ${usuario.nome}`, usuario.id_user, solicitacao.id_solicitacao],
        });
        
        const result_3 = await executeQuery({
            query: `INSERT INTO informacao (descricao, id_solicitacao, status_informacao, id_user  ) values(?,?,5,?)`,
            values: [solicitacao.informacao_entrega, solicitacao.id_solicitacao, usuario.id_user],
        });
        
        const result_4 = await executeQuery({
            query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
            values: [`Inserida a informação no status de 'Lançado' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao}  cuja descrição é '${solicitacao.informacao_entrega}'`, solicitacao.id_solicitacao],
        });
        
            const result_5 = await executeQuery({
                query: `INSERT INTO entrega (id_lancamento, id_user, data_entrega, created_at) values(?, ?, DATE_FORMAT('${solicitacao.data_entrega}', '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d'))`,
                values: [solicitacao.id_lancamento, usuario.id_user],
            });
       
            const result_6 = await executeQuery({
                query: `INSERT INTO historico (descricao, data, id_solicitacao ) values(?, DATE_FORMAT(now(), '%Y-%m-%d'), ?)`,
                values: [`Inserida nova 'Entrega' pelo usuario ${usuario.nome} da Solicitação  ${solicitacao.id_solicitacao} cujo id da entrega é ${result_5.insertId}`, solicitacao.id_solicitacao],
            });
            
        
        
        return 'Adicionado com sucesso!'
        
        }catch(error){
            return error;
        }
}








