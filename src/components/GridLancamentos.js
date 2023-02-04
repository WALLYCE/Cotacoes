import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import CardEntrega from './CardEntrega'
import {Grid} from "@mui/material";

export default function GridLancamentos(){
const {lancamentos} = useContext(DadosContext)

    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{lancamentos && lancamentos.map((item)=>{ // se existe solicitacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'lancamento'+item.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardEntrega dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }