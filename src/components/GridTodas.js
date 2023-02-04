import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import {Grid} from "@mui/material";
import CardTodas from "./CardTodas";
export default function GridTodas(){

const {todas} = useContext(DadosContext);

    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{todas && todas.map((item)=>{ // se existe cotacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'recusados'+item.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardTodas dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }