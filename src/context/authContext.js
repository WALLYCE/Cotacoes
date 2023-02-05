import { createContext, useContext, useState, useEffect} from "react";
import Router from "next/router";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { DadosContext } from "./dadosContext";
import { useRouter } from 'next/router';
export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(false);
    const {atualizaDados,adicionaEntrega, adicionaSolicitacao, adicionaCotacao, recusarCotacoes, autorizarCotacoes, adicionaLancamento, deletaSolicitacao} = useContext(DadosContext)
    const  router = useRouter();
    useEffect(()=>{
        try{
        
        const token = getCookie('authorization');
        if(!token) throw new Error('Token inexistente');
        validaToken(token);
        }catch(error){
           
            Router.push('/login')
        }

    }, []);

    
  async function validaToken(token_recuperado){
    try{
    const result = await axios.post('/api/users/logintoken', {token: token_recuperado});
    setUser({
        nome: result.data.nome,
        email: result.data.email,
        avatar_url: '',
        token: token_recuperado,
        cotacao: result.data.cotacao,
        autorizacao: result.data.autorizacao,
        recebimento: result.data.recebimento,
        compra: result.data.compra,
        delete: result.data.delete,
        admin: result.data.admin,
        ativo: result.data.ativo});
        setAuthenticated(true);
        atualizaDados(token_recuperado)
        const url = router.asPath;
        if(url == '/cadastro' && result.data.admin!=1){
            Router.push('/')
        }
    }catch(error){
        alert(error)
        Router.push('/login')
    }
  }


async function atualizaDadosAux(){
  atualizaDados(user.token);
}

async function signOut(){
       deleteCookie('authorization');
        setUser(null);
        setAuthenticated(false);
        Router.push('/login')
}
async function adicionaSolicitacaoAux(dados){
try{
const result = await adicionaSolicitacao( {
    ...dados,
    token: user.token
   })
   if(result instanceof Error)throw new Error(result.response.data)
   return result;
}catch(error){
    return error;
}
}

function authCotar(){
    if(user.cotacao == 1){
        return true;
    }else{
        return false;
    }
}

async function adicionaUsuario(usuario){
    try{
        const resultado = await axios.post('/api/users/cadastro', {usuario: usuario, token: user.token});
        if(resultado.data instanceof Error) throw new Error(resultado.message)
        return resultado.data;
        }
        catch(error){
            console.log(error.message)
            return error;
        }
}


function authAdmin(){
    if(user != null && user.admin == 1){
        return true;
    }else{
        return false;
    }
}


function authAutorizar(){
    if(user.autorizacao == 1){
        return true;
    }else{
        return false;
    }
}

function authLancar(){
    if(user.compra == 1){
        return true;
    }else{
        return false;
    }
}

function authReceber(){
    if(user.recebimento == 1){
        return true;
    }else{
        return false;
    }
}

function authDelete(){
    if(user.delete == 1){
        return true;
    }else{
        return false;
    }
}

async function adicionaCotacaoAux(dados){
    try{
        const valor = {...dados, token: user.token}
        const result = await adicionaCotacao(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}

async function recusarCotacoesAux(dados){
    try{
        const valor = await {...dados, token: user.token};
        console.log(valor)
        const result = await recusarCotacoes(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}
async function getToken(){
    if(user){
        return user.token;
    }else{
        await user;
        return user;
    }
}
async function autorizarCotacoesAux(dados){
    try{
        const valor = await {...dados, token: user.token};
        console.log(valor)
        const result = await autorizarCotacoes(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}

async function UpdateUser(dados){
    try{
        console.log(dados)
        const valor = await {usuario: dados,token: user.token};
        
        const resultado = await axios.post('/api/users/update', valor)
        return resultado.data;
        }
        catch(error){
            return error;
        }
}

async function signIn(dados){
    try{
        const result = await axios.post('/api/users/login', dados);
        setCookie('authorization', result.data.token, {
            maxAge: 60*60*1, //expira em 1 hora
        });
        setUser({
                nome: result.data.nome,
                email: result.data.email,
                avatar_url: '',
                token: result.data.token,
                cotacao: result.data.cotacao,
                autorizacao: result.data.autorizacao,
                recebimento: result.data.recebimento,
                compra: result.data.compra,
                delete: result.data.delete,
                admin: result.data.admin,
                ativo: result.data.ativo});
        setAuthenticated(true);
        atualizaDados(result.data.token);
        Router.push('/')
        return 'Sucesso';
        
    }catch(error){
        return error;
       
    }
  }

async function getUsers(){
    try{
        const valor = await {token: user.token};
        const resultado = await axios.post('/api/users/consultar', valor)
        console.log(resultado.data)
        return resultado.data;
        }
        catch(error){
            return error;
        }
}


async function lancamentoAux(dados){
    try{
        const valor = await {...dados, token: user.token};
        const result = await adicionaLancamento(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}

async function adicionaEntregaAux(dados){
    try{
        const valor = await {...dados, token: user.token};
        const result = await adicionaEntrega(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}

async function deletaSolicitacaoAux(dados){
    try{
        const valor = await {...dados, token: user.token};
        const result = await deletaSolicitacao(valor);
       if(result instanceof Error)throw new Error(result.response.data);
       return result;
    }catch(error){
        return error;
    }
}
    return (
        <AuthContext.Provider value={{user: user, authenticated: authenticated, setUser: setUser, getToken: getToken, getUsers: getUsers, UpdateUser: UpdateUser, signOut: signOut,adicionaUsuario: adicionaUsuario, deletaSolicitacaoAux: deletaSolicitacaoAux,authDelete: authDelete,authAdmin: authAdmin, adicionaEntregaAux: adicionaEntregaAux,authReceber: authReceber, lancamentoAux: lancamentoAux, authLancar: authLancar, autorizarCotacoesAux: autorizarCotacoesAux, recusarCotacoesAux: recusarCotacoesAux,authAutorizar: authAutorizar, signIn: signIn, authenticated: authenticated, authCotar: authCotar, atualizaDadosAux, atualizaDadosAux,adicionaSolicitacaoAux: adicionaSolicitacaoAux, adicionaCotacaoAux: adicionaCotacaoAux}}>
            {children}
        </AuthContext.Provider>
    )
}