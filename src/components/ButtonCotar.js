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

export default function ButtonCotar(props) {
  const [open, setOpen] = React.useState(false);
  const {adicionaCotacaoAux, atualizaDadosAux, authCotar} = React.useContext(AuthContext);
  const [informacao, setInformacao] = React.useState('');
  const [openloading, setOpenloading] = React.useState(false);

  const [arrayCotacoes, setArrayCotacoes] = React.useState([
    {
        fornecedor: '',
        valor_unidade: '',
        frete: '',
        impostos: '',
        valor_final: '',
        prazo: ''
      }
  ])




  const [solicitacao, setSolicitacao] = React.useState({
    nome: '',
    data:  '',
    infomacao:'',
    produto: '',
    unidade: '',
    quantidade: ''
  }) 


  const handleClickOpen = () => {
   if(authCotar()){
       setOpen(true);
   }else{
    toast.error('Você não tem autorização para Cotar', {
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


React.useEffect(()=>{
   setSolicitacao( {
        id_solicitacao: props.dados.id_solicitacao,
        nome: props.dados.nome,
        data:  props.dados.created_at,
        infomacao: props.dados.descricao_info_solicitacao,
        produto: props.dados.produto,
        unidade: props.dados.unidade_medida,
        quantidade: props.dados.quantidade
      }
   )
  }, [])


  const handleClick = async (event)=>{
    try{
    setOpenloading(true)
    arrayCotacoes.map((item)=>{
      if(item.fornecedor == '' || item.valor_unidade == '' || item.frete == '' || item.prazo == '' || item.valor_final == '') throw new Error('Não deixe campos em Branco!!\nCaso não tenha valor coloque 0 ou remova as cotações não terminadas\n')
    })
    const result = await adicionaCotacaoAux({solicitacao: solicitacao, cotacoes: arrayCotacoes, informacao: informacao});
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

  }


  const handleClickAddCotacao = async(event)=>{
    setArrayCotacoes(arrayCotacoes => [...arrayCotacoes,   {
        fornecedor: '',
        valor_unidade: '',
        frete: '',
        impostos: '',
        valor_final: '',
        prazo: ''
      }])
        
  }

  const handleClickRemoveCotacao = async(event)=>{
    if(arrayCotacoes.length > 1){
    setArrayCotacoes(arrayCotacoes.slice(0, arrayCotacoes.length-1))
    }
    else{
      toast.error('Ao menos 1 cotação é Obrigatória', {
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

  const handleChange = (event) =>{
    const arraynovo = arrayCotacoes;
    const indice = event.target.getAttribute('id_array');
    const {value, name} = event.target;
    arraynovo[indice][name]= value;
    setArrayCotacoes(arraynovo);
  }


  return (
    <>      
     
      <Button variant="contained" onClick={handleClickOpen}>
        Cotar
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
          Realizar Cotação
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <ToastContainer/>
        <Loading open={openloading} close={()=>setOpenloading(false)}/>
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
                    <Grid item xs={12}>
                    <TextField
                            placeholder="Informações adicionais da Cotação"
                            multiline
                            name='Informacao da Solicitacao'
                            rows={4}
                            fullWidth={true}
                            variant="outlined"
                            onChange={(event)=>setInformacao(event.target.value)}
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

                    <Grid item xs={3} >
                         <Button variant="contained" onClick={handleClickAddCotacao}>Adicionar Cotação</Button>                  
                    </Grid>
                    <Grid item xs={9} >
                         <Button variant="contained" color="error" onClick={handleClickRemoveCotacao}>  Remover Cotação</Button> 
                    </Grid>
                    {arrayCotacoes && arrayCotacoes.map((item, index)=>{

                        return(
                          <Grid  container spacing={2} mt={2} key={'cotarmenu'+index}>
                            <Grid item xs={2}>
                            <TextField onChange={handleChange} 
                                     inputProps={{
                                      id_array: index
                                   }} 
                             defaultValue={arrayCotacoes[index]['fornecedor']}
                             id="outlined-basic" fullWidth={true} label="Fornecedor"  name='fornecedor' variant="outlined" />
                            </Grid>
              
                            <Grid item xs={2}>
                                <TextField 
                                onChange={handleChange} 
                                inputProps={{
                                 id_array: index
                              }} 
                               defaultValue={arrayCotacoes[index]['valor_unidade']}
                               id="outlined-basic" fullWidth={true}   helperText="Somente números."   type="number" label="Preço unitário"  name='valor_unidade' variant="outlined" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField onChange={handleChange} 
                                inputProps={{
                                 id_array: index
                              }} 
                               defaultValue={arrayCotacoes[index]['frete']}
                               id="outlined-basic" fullWidth={true} label="Frete"  helperText="Somente números."  type="number" name='frete' variant="outlined" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField onChange={handleChange} 
                                inputProps={{
                                 id_array: index
                              }} 
                               defaultValue={arrayCotacoes[index]['impostos']}
                               id="outlined-basic" fullWidth={true} label="Impostos"   helperText="Somente números."   type="number" name='impostos' variant="outlined"/>
                            </Grid>
                            <Grid item xs={2}>
                            <TextField onChange={handleChange} 
                                inputProps={{
                                 id_array: index
                              }} 
                               defaultValue={arrayCotacoes[index]['prazo']}
                               id="outlined-basic" fullWidth={true} label="Prazo" name='prazo' variant="outlined" />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField  onChange={handleChange} 
                                inputProps={{
                                 id_array: index
                              }} 
                               defaultValue={arrayCotacoes[index]['valor_final']}
                               id="outlined-basic" fullWidth={true} label="Valor total"  helperText="Somente números."   type="number"  name='valor_final' variant="outlined" />
                            </Grid>
                            </Grid>
                        
                       
                            
                        )
                    })}
             
                     {/*fim da parte da cotação*/}



        </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClick}>
            Realizar Cotações
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}