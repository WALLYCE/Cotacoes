import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Alert } from '@mui/material';
import { setCookie } from 'cookies-next'; //função cria cookie
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/components/Loading';

const theme = createTheme();

export default function Login() {

const [values,setValues] = useState({email: '', password: ''});
const [alert, setAlert] = useState(false);
const {signIn} = React.useContext(AuthContext);
const [openloading, setOpenloading] = useState(false)
const router = useRouter();

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
      const result = await signIn(values);
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
        })
      }
      setOpenloading(false)
    }




  return (
    <ThemeProvider theme={theme}>
      <Loading open={openloading} close={()=>setOpenloading(false)}/>
      <ToastContainer/>
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
          Sistema de Cotações
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
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
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              Entrar
            </Button>
            {alert ? <Alert  onClose={() => {setAlert(false)}} variant="filled" severity="error">erro</Alert> : <></> }
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}