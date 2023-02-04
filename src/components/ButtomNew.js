import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import {Grid} from '@mui/material';
import format from 'date-fns/format';
import axios from 'axios';
import { AuthContext } from '@/context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ButtonNew() {
  
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(format(new Date, 'dd/MM/yyyy'));
  const {adicionaSolicitacaoAux, atualizaDadosAux} = React.useContext(AuthContext);
  const [solicitacao, setSolicitacao] = React.useState({
    nome: '',
    data:  data,
    infomacao: '',
    produto: '',
    unidade: '',
    quantidade: ''
  }) 
  const [openloading, setOpenloading] = React.useState(false)

    
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
  setOpen(false)

  };

  const handleClick = async (event)=>{
    try{
        setOpenloading(true)
        if(solicitacao.nome=='') throw new Error('Campo nome obrigatório')
        if(solicitacao.produto =='')  throw new Error('Campo produto obrigatório')
        if(solicitacao.unidade =='')  throw new Error('Campo unidade de medida obrigatório');
        if(solicitacao.quantidade =='')  throw new Error('Campo quantidade obrigatório');
 
         const result = await adicionaSolicitacaoAux(solicitacao);
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
        console.log(result)
        atualizaDadosAux();
        setOpen(false);
        setData(format(new Date, 'dd/MM/yyyy'));
        setSolicitacao({
          nome: '',
          data:  data,
          infomacao: '',
          produto: '',
          unidade: '',
          quantidade: ''
        })
    }

    catch (error){
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
    setOpenloading(false)
  }
  
  const handleChange = (event) =>{
    const {value, name} = event.target;
    setSolicitacao({
        ...solicitacao,
        [name]: value,
    })
  }
  return (
    <div>
      <ToastContainer/>
      <Button variant="contained" onClick={handleClickOpen}>
        Nova Solicitação
      </Button>
      <BootstrapDialog
        maxWidth={'lg'}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" align={'center'} onClose={handleClose}>
          Nova solicitação
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <Loading open={openloading} close={()=>setOpenloading(false)}/>
        <Grid container spacing={2}>
                    <Grid item xs={8}>
                            <TextField onChange={handleChange} id="outlined-basic" fullWidth={true} label="nome" value={solicitacao.nome} name="nome" variant="outlined" />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                            disabled
                            id="filled-disabled"
                            label="Data"
                            defaultValue={data}
                            variant="filled"
                            fullWidth={true}
                            />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                            placeholder="Informações adicionais da solicitação"
                            multiline
                            name='informacao'
                            onChange={handleChange}
                            value={solicitacao.informacao}
                            rows={4}
                            fullWidth={true}
                            />
                    </Grid>

                    <Grid item xs={6}>
                    <TextField onChange={handleChange} id="outlined-basic" fullWidth={true} value={solicitacao.produto} label="Produto" name='produto' variant="outlined" />
                    </Grid>
                    <Grid item xs={3}>
                    <TextField onChange={handleChange} id="outlined-basic" fullWidth={true} value={solicitacao.unidade} label="Unidade de Medida" name='unidade' variant="outlined" />
                    </Grid>
                    <Grid item xs={3}>
                    <TextField onChange={handleChange} id="outlined-basic" fullWidth={true} label="Quantidade" value={solicitacao.quantidade} name='quantidade' variant="outlined" />
                    </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClick}>
            Adicionar Solicitação
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}