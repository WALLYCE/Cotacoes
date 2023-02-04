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
import { Container, TextField, Typography } from '@mui/material';
import {Grid} from '@mui/material';
import format from 'date-fns/format';
import { DadosContext } from '@/context/dadosContext';
import { AuthContext } from '@/context/authContext';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '@/components/Loading';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-container": {
    alignItems: "flex-start"
  }
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

export default function ButtonDelete(props) {
  const [open, setOpen] = React.useState(false);
  const {atualizaDadosAux, authDelete, deletaSolicitacaoAux} = React.useContext(AuthContext);
  const [openloading, setOpenloading] = React.useState(false);




  const [solicitacao, setSolicitacao] = React.useState({
    nome: '',
    data:  '',
    infomacao:'',
    produto: '',
    unidade: '',
    quantidade: ''
  }) 


  const handleClickOpen = () => {
  setOpen(true)
  };
    const handleClose = () => {
     setOpen(false)
    
};

const handleDelete = async () =>{
    if(authDelete()){
    try{
    setOpenloading(true)
    const result = await deletaSolicitacaoAux(solicitacao);
    if(result instanceof Error)throw new Error(result);
    setOpen(false)
    atualizaDadosAux();
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
    }else{
     toast.error('Você não tem autorização para Deletar', {
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


React.useEffect(()=>{
   setSolicitacao( {
        id_solicitacao: props.dados.id_solicitacao,
        nome: props.dados.nome,
        data:  props.dados.created_at,
        infomacao: props.dados.descricao,
        produto: props.dados.produto,
        unidade: props.dados.unidade_medida,
        quantidade: props.dados.quantidade
      }
   )
  }, [])





  return (
    
   <Container>
     <Grid container spacing={2} component='div'> 
      <ToastContainer/>
      <Loading open={openloading} close={()=>setOpenloading(false)}/>
          <Grid item textAlign={'right'} xs={6}>
            <Button variant="contained" onClick={handleClickOpen}>
            Visualizar
            </Button>
          </Grid>
          <Grid item  textAlign={'left'} xs={6}>
              <Button ml={2} variant="contained" color="error" onClick={handleDelete}>
              Deletar
              </Button>
          </Grid>
      </Grid>
   
      <BootstrapDialog
        maxWidth={'lg'}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
       PaperProps={{sx: {position: "top"}}}
        sx={{zIndex: 0}}
      >

        <BootstrapDialogTitle id="customized-dialog-title" align={'center'} onClose={handleClose}>
          Realizar Cotação
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <Grid container spacing={2}>
                    <Grid item xs={8}>
                            <TextField disabled id="outlined-basic" fullWidth={true} label="nome" value={solicitacao.nome} name="nome" variant="filled" />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                            disabled
                            id="filled-disabled"
                            label="Data da solicitação"
                            defaultValue={solicitacao.data && format(new Date(solicitacao.data), 'dd/MM/yyyy')}
                            variant="filled"
                            fullWidth={true}
                            />
                    </Grid>
                    <Grid item xs={12}>
                     Informações adicionais da solicitação
                          <TextField
                                  multiline
                                  name='Informacao da Solicitacao'
                                  defaultValue={`SOLICITANTE: ${solicitacao.nome}\nINFORMAÇÃO SOLICITAÇÃO: ${solicitacao.infomacao}`}
                                  rows={4}
                                  fullWidth={true}
                                  variant="filled"
                                  disabled
                                  />
                    </Grid>

                    {/*informações do produto*/}
                    <Grid item xs={6}>
                    <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={solicitacao.produto} label="Produto" name='produto' />
                    </Grid>
                    <Grid item xs={3}>
                    <TextField disabled id="outlined-basic" fullWidth={true} value={solicitacao.unidade} label="Unidade de Medida" name='unidade' variant="filled" />
                    </Grid>
                    <Grid item xs={3}>
                    <TextField disabled  id="outlined-basic" fullWidth={true} label="Quantidade" value={solicitacao.quantidade} name='quantidade' variant="filled" />
                    </Grid>
                     {/*fim das informações do produto*/}



        </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>setOpen(false)}>
            Sair
          </Button>
        </DialogActions>
      </BootstrapDialog>
      </Container>
  );
}

