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
import { TextField, Typography } from '@mui/material';
import {Grid} from '@mui/material';
import format from 'date-fns/format';
import { DadosContext } from '@/context/dadosContext';
import { AuthContext } from '@/context/authContext';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FormControlLabel} from '@mui/material';
import {Switch} from '@mui/material';
import { Prosto_One } from '@next/font/google';
import {DialogContentText} from '@mui/material';


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

export default function ButtonVisualizarRecusado(props) {
  const [open, setOpen] = React.useState(false);
  const {atualizaDadosAux, authAutorizar,autorizarCotacoesAux, recusarCotacoesAux} = React.useContext(AuthContext);
  const [informacao, setInformacao] = React.useState('')
  const [dialogRecusa, setDialogRecusa] = React.useState(false)


  const [solicitacao, setSolicitacao] = React.useState({}) 


  const handleClickOpen = () => {
   
   if(authAutorizar()){
       
       setOpen(true);
   }else{
    toast.error('Você não tem autorização suficiente para autorizar compras', {
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
  };


  const handleClose = () => {
     setOpen(false)
    
    };

 const handleClickRecusaCotacoes = async() =>{
  try{
    const result = await recusarCotacoesAux({...solicitacao, informacao_autorizacao: informacao});
    if(result instanceof Error)throw new Error(result);
    setOpen(false);
    setDialogRecusa(false);
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
    atualizaDadosAux();

    
  }catch(error){
    if(error.message != ''){
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
 }


  React.useEffect(()=>{  
   setSolicitacao( {
        id_solicitacao: props.dados.solicitacao.id_solicitacao,
        nome: props.dados.solicitacao.nome,
        data: props.dados.solicitacao.created_at,
        user_cotacao: props.dados.solicitacao.usuario_info_cotacao,
        user_solicitacao: props.dados.solicitacao.usuario_info_solicitacao,
        informacao_solicitacao: props.dados.solicitacao.descricao_info_solicitacao,
        informacao_cotacao: props.dados.solicitacao.descricao_info_cotacao,
        produto: props.dados.solicitacao.produto,
        unidade: props.dados.solicitacao.unidade_medida,
        quantidade:props.dados.solicitacao.quantidade,
        cotacoes: props.dados.cotacoes
      }
   )

  
  }, [])


  const handleClick = async (event)=>{
    try{
    var escolha_autorizado = false;
    solicitacao.cotacoes.map((item)=>{
      if(item.autorizado == 'true') {
        escolha_autorizado = true;
      }
    })
    if(!escolha_autorizado){
      setDialogRecusa(true);
      throw new Error('');
    }
    const result = await autorizarCotacoesAux({...solicitacao, informacao_autorizacao: informacao})
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

    
  }catch(error){
    if(error.message != ''){
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
  }



  const handleSelect = (event) =>{
    const novoEstado = {...solicitacao};
    const id = parseInt(event.target.getAttribute('id'));
    novoEstado.cotacoes.map((item)=>{
      if(item.id_cotacao == id){
        if(item.autorizado == "true"){
          item.autorizado = "false";
        }else{
        item.autorizado = "true";
        }
      }else{
        item.autorizado = "false";
      }
    })
    setSolicitacao(novoEstado)
  }

  return (
    <>      
     
      <Button variant="contained" onClick={handleClickOpen}>
        Visualizar
      </Button>

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
          Visualizar solicitação recusada
        </BootstrapDialogTitle>
        <DialogContent dividers>

      {/*Dialog Resusar*/}
        <Dialog
        open={dialogRecusa}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Deseja realmente resusar as cotações?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Você não autorizou nenhuma cotação, deseja mesmo recusar as cotações?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={()=>setDialogRecusa(false)} color="success">  <Typography variant="h7">Não, desejo voltar e escolher uma cotação</Typography></Button>
          <Button variant='contained' color="error" onClick={handleClickRecusaCotacoes} > <Typography variant="h7">Sim, desejo recusar todas as cotações</Typography></Button>
        </DialogActions>
      </Dialog>
    {/*Dialog Resusar*/}


        <ToastContainer/>
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
                    <Grid item xs={6}>
                     Informações adicionais da solicitação
                    <TextField
                            multiline
                            name='Informacao da Solicitacao'
                            defaultValue={`Usuário: ${solicitacao.user_solicitacao}\nINFORMAÇÃO DA SOLICITAÇÃO: ${solicitacao.informacao_solicitacao}`}
                            rows={4}
                            fullWidth={true}
                            variant="filled"
                            disabled
                            />
                    </Grid>
                    <Grid item xs={6}>
                    Informações adicionais da cotação
                    <TextField
                           multiline
                           name='Informacao da Solicitacao'
                           defaultValue={`Usuário: ${solicitacao.user_cotacao}\nINFORMAÇÃO DA COTAÇÃO: ${solicitacao.informacao_cotacao}`}
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

                    {/*parte da cotação*/}
                    </Grid>
                    {solicitacao.cotacoes && solicitacao.cotacoes.map((item, index)=>{

                        return(
                          <Grid container spacing={1} mt={2} key={uuidv4()}>
                          <Grid item xs={12}>
                          <Grid  container spacing={2}>
                            <Grid item xs={2}>
                            <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.fornecedor} label="Fornecedor" name='produto' />

                            </Grid>
              
                            <Grid item xs={2}>
                              <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.valor_unidade} label="Valor unidade" name='produto' />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.frete} label="Frete" name='produto' />
                            </Grid>
                            <Grid item xs={2}>
                               <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.impostos} label="Impostos" name='produto' />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.prazo} label="Prazo" name='produto' />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField disabled variant="filled" id="outlined-basic" fullWidth={true} value={item.valor_final} label="valor_final" name='produto' />
                            </Grid>
                            </Grid>
                        
                             </Grid>

                            </Grid>
                        )
                    })}
             
                     {/*fim da parte da cotação*/}




        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>setOpen(false)}>
            Sair
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
