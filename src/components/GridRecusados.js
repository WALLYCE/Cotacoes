import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import {Grid} from "@mui/material";
import CardRecusados from "./CardRecusados";
import { v3 as uuidv3 } from 'uuid';

export default function GridRecusados(){
const {recusados} = useContext(DadosContext)
    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{recusados && recusados.map((item)=>{ // se existe cotacoes eu realizo um map nelas e crio um card pra cada
        console.log(item)
        return(
            <Grid key={'recusados'+item.solicitacao.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardRecusados dados={item} />
           </Grid>
        )
     })}
     
     </Grid>
     </div>
     ); 
    }