import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/authContext';
import {Checkbox} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from 'cookies-next';
import Router from 'next/router';
import { useContext } from 'react';
import {FormControlLabel} from '@mui/material';
import { ArrowBackIosTwoTone } from '@mui/icons-material';
const theme = createTheme();


export default function cadastro() {

const [users, setUsers] = useState(null)
const {UpdateUser, setUser, authAdmin, user, authenticated, getToken} = useContext(AuthContext);
const [autenticado, setAutenticado] = useState(false)

const router = useRouter();
React.useEffect(()=>{
 setAutenticado(authenticated);
}, [authenticated])
React.useEffect(()=>{

  const dados = async function  (){
  if(autenticado){
  try{
  const tokens = await getToken();
  const resposta = await axios.post('/api/users/consultar', {token: tokens })
  const usuarios = resposta.data;
  usuarios.map((item)=>{
      if(item.cotacao == 1){
         item.cotacao = true;
        }else{
         item.cotacao = false;
        }
        if(item.autorizacao == 1){
          item.autorizacao = true;
         }else{
          item.autorizacao= false;
         }
         if(item.compra == 1){
          item.compra = true;
         }else{
          item.compra = false;
         }
         if(item.recebimento == 1){
          item.recebimento = true;
         }else{
          item.recebimento = false;
         }
         if(item.ativo == 1){
          item.ativo= true;
         }else{
          item.ativo = false;
         }
  })
  
  setUsers(usuarios)
}catch(error){
  toast.error(error.response.data, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
}
}
}
dados();
},[autenticado])
 

const handleClick = async (event)=>{
  try{
    const id = event.target.getAttribute('id');
  
    const result = await UpdateUser(users[id]);
    
    //const result = await adicionaUsuario(values);
    if(result instanceof Error)throw new Error(result.response.data);

    const resposta = await axios.post('/api/users/consultar')
    const usuarios = resposta.data;
    usuarios.map((item)=>{
        if(item.cotacao == 1){
           item.cotacao = true;
          }else{
           item.cotacao = false;
          }
          if(item.autorizacao == 1){
            item.autorizacao = true;
           }else{
            item.autorizacao= false;
           }
           if(item.compra == 1){
            item.compra = true;
           }else{
            item.compra = false;
           }
           if(item.recebimento == 1){
            item.recebimento = true;
           }else{
            item.recebimento = false;
           }
           if(item.ativo == 1){
            item.ativo= true;
           }else{
            item.ativo = false;
           }
          })
    
      setUsers(usuarios)
    toast.success(result, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });

  }catch(error){
    toast.error(error.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    }
  

}


  return (
     
 
      <>
        <ToastContainer/>
       {users && users.map((us, index)=>{
            return(<Grid container key={'container_updtate'+index} >
                <Grid item xs={2}>
                <TextField disabled id="outlined-basic" fullWidth={true} label="nome" value={us.name} name="nome" variant="filled" />
                </Grid>
                <Grid item xs={2} >
                <TextField disabled id="outlined-basic" fullWidth={true} label="email" value={us.email} name="email" variant="filled" />
                </Grid>
                <Grid item xs={2} >
                <TextField  id="outlined-basic" onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].password = e.target.value;
                    setUsers(newUsers)
                   }}
                   
                   fullWidth={true} label="password" type='password' value={us.password} name="password" variant="filled" />
                </Grid>
                <Grid item xs={1} >
                  <FormControlLabel   label='Cotar' control={<Checkbox checked={us.cotacao} 
                  onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].cotacao = e.target.checked;
                    setUsers(newUsers)
                   }}
                    name='cotacao' />}/>
                </Grid>
                <Grid item xs={1} >
                  <FormControlLabel  label='Autorizar' control={<Checkbox checked={us.autorizacao} onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].autorizacao = e.target.checked;
                    setUsers(newUsers)
                   }} name='autorizacao' />}/>
                </Grid>
                <Grid item xs={1} >
                  <FormControlLabel  label='Lançar'  control={<Checkbox checked={us.compra} 
                  onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].compra = e.target.checked;
                    setUsers(newUsers)
                   }} name='compra' />}/>
                </Grid>
                <Grid item xs={1} >
                  <FormControlLabel label='Entrega' control={<Checkbox checked={us.recebimento}   onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].recebimento = e.target.checked;
                    setUsers(newUsers)
                   }}
                   name='recebimento' />}/>
                </Grid>
                <Grid item xs={1} >
                  <FormControlLabel label='Ativo' control={<Checkbox checked={us.ativo}  
                  onChange={(e)=>{
                    const newUsers = [...users];
                    newUsers[index].ativo = e.target.checked;
                    setUsers(newUsers)
                   }} name='ativo' />}/>
                </Grid>
                <Grid item xs={1} >
                <Button variant="contained" id={index}  onClick={handleClick} color="success">
                        Salvar
                        </Button>
                </Grid>
                </Grid>   
                
            )
        })}
   
   </>

  );
}