import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import {Grid} from "@mui/material";
import CardAutorizar from "./CardAutorizar";
import { v3 as uuidv3 } from 'uuid';

export default function GridCotacoes(){
const {cotacoes} = useContext(DadosContext)
    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{cotacoes && cotacoes.map((item)=>{ // se existe cotacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'cotacao'+item.solicitacao.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardAutorizar dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }