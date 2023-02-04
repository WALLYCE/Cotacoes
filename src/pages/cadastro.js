import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Alert } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/authContext';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {Checkbox} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
import Loading from '@/components/Loading';

const theme = createTheme();

export default function cadastro() {

const [values,setValues] = useState({email: '', password: '', name: '', cotar: false, autorizar: false, lancar: false, receber: false});
const [alert, setAlert] = useState(false);
const {adicionaUsuario, authAdmin, user} = React.useContext(AuthContext);
const router = useRouter();
const [openloading, setOpenloading] = React.useState(false);


const handleChange = (event) =>{
    const {value, name} = event.target;
    setValues({
        ...values,
        [name]: value,
    })
}


const handleClick = async (event)=>{
  try{
    setOpenloading(true)
      if(!authAdmin()) throw new Error('Somente o administrador pode cadastrar usuários\n')
      if(values.email== '' || values.password == '' || values.name == '') throw new Error('Não deixe os campos em Branco!!\n\n')
    
    const result = await adicionaUsuario(values);
    if(result instanceof Error)throw new Error(result.response.data);
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

      setValues({email: '', password: '', name: '', cotar: false, autorizar: false, lancar: false, receber: false})
      setOpenloading(false)
    
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
      setOpenloading(false)
    }
  

}


  return (
    <ThemeProvider theme={theme}>
      <ToastContainer/>
      <Loading open={openloading} close={()=>setOpenloading(false)}/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          Adicionar Usuario
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddAlt1Icon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Nome"
              type="text"
              id="name"
              value={values.name}
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              Cadastrar
            </Button>
            {alert ? <Alert  onClose={() => {setAlert(false)}} variant="filled" severity="error">erro</Alert> : <></> }
            <Grid container spacing={1}>
              <Grid item xs={12}  textAlign='center'>
              <Typography>Autorizações</Typography>
              </Grid>
              <Grid item xs={3} textAlign={'center'} border={1} >
              <Typography >Cotação</Typography>
              <FormControlLabel control={<Checkbox checked={values.cotar}  onChange={(e)=>{setValues({...values, cotar: e.target.checked})}} name='cotacao' />} />
              </Grid>

              <Grid item xs={3} textAlign={'center'} border={1} >
              <Typography textAlign={'center'}>Autorização</Typography>
              <FormControlLabel control={<Checkbox checked={values.autorizar}  onChange={(e)=>{setValues({...values, autorizar: e.target.checked})}} name='autorizacao' />} />
              </Grid>


              <Grid item xs={3}  textAlign={'center'}  border={1} >
              <Typography textAlign={'center'}>Lançamento</Typography>
              <FormControlLabel control={<Checkbox checked={values.lancar}  onChange={(e)=>{setValues({...values, lancar: e.target.checked})}} name='lancamento' />}/>
              </Grid>


              <Grid item xs={3} textAlign={'center'} border={1} >
              <Typography textAlign={'center'}>Entrega</Typography>
              <FormControlLabel control={<Checkbox checked={values.receber} onChange={(e)=>{setValues({...values, receber: e.target.checked})}}  name='entrega' />}/>
              </Grid>


            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}