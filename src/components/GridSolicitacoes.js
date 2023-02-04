import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import CardCotar from './CardCotar'
import {Grid} from "@mui/material";

export default function GridSolicitacoes(){
const {solicitacoes} = useContext(DadosContext)

    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{solicitacoes && solicitacoes.map((item)=>{ // se existe solicitacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'solicitacao'+item.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardCotar dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }