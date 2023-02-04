import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect } from "react";
import {Grid} from "@mui/material";
import CardConcluido from "./CardConcluido";

export default function GridConcluidos(){
const {concluidos} = useContext(DadosContext)
    return (
    <div>
     <Grid 
     container
     direction="column"
     justifyContent="center"
     alignItems="center" 
     spacing={2}
     >{concluidos && concluidos.map((item)=>{ // se existe cotacoes eu realizo um map nelas e crio um card pra cada
        return(
            <Grid key={'concluidos'+item.id_solicitacao} item xs={12} sx={{width: '100%'}}>
            <CardConcluido dados={item} />
           </Grid>
        )
     })}
     </Grid>
     </div>
     ); 
    }