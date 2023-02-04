import { createContext, useContext, useState, useEffect} from "react";

import axios from "axios";
export const DadosContext = createContext();

export const DadosContextProvider = ({children})=>{

    const[solicitacoes, setSolicitacoes] = useState(null);
    const[cotacoes, setCotacoes] = useState(null);
    const[autorizados, setAutorizados] = useState(null);
    const[lancamentos, setLancamentos] = useState(null)
    const[concluidos, setConcluidos] = useState(null)
    const[recusados, setRecusados] = useState(null)
    const[todas, setTodas] = useState(null)
    const[loading, setLoading] = useState(false)

    const atualizaDados = async (token) =>{
        setLoading(true);
       await atualizaSolicitacoes(token);
       await atualizaCotacoes(token);
       await atualizaAutorizados(token);
       await atualizaLancamentos(token);
       await atualizaConcluidos(token);
       await atualizaRecusados(token);
       await atualizaTodas(token);
       setLoading(false);
    }
    
    const atualizaSolicitacoes = async(token) =>{
        const dados = await axios.post('http://localhost:3000/api/solicitacao/consulta', {token: token});
        setSolicitacoes(dados.data);
    
    }

    const atualizaTodas = async(token) =>{
        const dados = await axios.post('http://localhost:3000/api/todas/consultar', {token: token});
        setTodas(dados.data);

    }
    const atualizaCotacoes = async(token) =>{
            const dados = await axios.post('http://localhost:3000/api/cotacao/consulta', {token: token});
            setCotacoes(dados.data);
        }

   const atualizaAutorizados = async(token) =>{
            const dados = await axios.post('http://localhost:3000/api/autorizacao/autorizados', {token: token});
            setAutorizados(dados.data);
        }
    const adicionaSolicitacao = async(dados) =>{
        try{
            const resultado = await axios.post('http://localhost:3000/api/solicitacao/adicionar', dados)
            return resultado.data;
            }
            catch(error){
                return error;
            }
    }
    const atualizaRecusados = async(token)=>{
        
            const resultado = await axios.post('http://localhost:3000/api/cotacao/recusados', {token: token})
            setRecusados(resultado.data)
    }
    const atualizaLancamentos = async (token) =>{
      
            const resultado = await axios.post('http://localhost:3000/api/lancamento/consulta', {token: token})
            setLancamentos(resultado.data)
            
    }
    const atualizaConcluidos = async (token)=>{
        const resultado = await axios.post('http://localhost:3000/api/entrega/consulta', {token: token})
        setConcluidos(resultado.data)
    }

    const adicionaCotacao = async(dados) =>{
        try{
        const resultado = await axios.post('http://localhost:3000/api/cotacao/adicionar', dados)
        return resultado.data;
        }
        catch(error){
            return error;
        }
    }
    
    
    const deletaSolicitacao = async(dados) =>{
        try{
        const resultado = await axios.post('http://localhost:3000/api/solicitacao/deletar', dados)
        return resultado.data;
        }
        catch(error){
            return error;
        }
    }
    
    const adicionaLancamento = async(dados) =>{
        try{
        const resultado = await axios.post('http://localhost:3000/api/lancamento/adicionar', dados)
        return resultado.data;
        }
        catch(error){
            return error;
        }
    }
     
    
    const adicionaEntrega = async(dados) =>{
        try{
        const resultado = await axios.post('http://localhost:3000/api/entrega/adicionar', dados)
        return resultado.data;
        }
        catch(error){
            return error;
        }
    }
     
    const recusarCotacoes = async(dados)=>{
        try{
            const resultado = await axios.post('http://localhost:3000/api/autorizacao/recusar', dados)
            return resultado.data;
            }
            catch(error){
                return error;
            }
    }

    const autorizarCotacoes = async(dados)=>{
        try{
            const resultado = await axios.post('http://localhost:3000/api/autorizacao/autorizar', dados)
            return resultado.data;
            }
            catch(error){
                return error;
            }
    }


    return (
        <DadosContext.Provider value={{loading: loading,setLoading: setLoading, todas: todas, solicitacoes: solicitacoes, cotacoes: cotacoes,autorizados: autorizados,lancamentos: lancamentos, concluidos: concluidos,recusados:recusados,deletaSolicitacao: deletaSolicitacao,adicionaEntrega: adicionaEntrega, adicionaLancamento: adicionaLancamento, autorizarCotacoes: autorizarCotacoes, recusarCotacoes: recusarCotacoes, atualizaSolicitacoes: atualizaSolicitacoes, atualizaDados: atualizaDados,adicionaSolicitacao: adicionaSolicitacao, adicionaCotacao: adicionaCotacao }}>
            {children}
        </DadosContext.Provider>
    )
}