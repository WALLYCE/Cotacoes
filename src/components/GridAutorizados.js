import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import {Grid} from "@mui/material";
import CardLancamento from "./CardLancamento";
import { v3 as uuidv3 } from 'uuid';

export default function GridCotacoes(){
const {autorizados} = useContext(DadosContext)
    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{autorizados && autorizados.map((item)=>{ // se existe cotacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'autorizados'+item.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardLancamento dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }