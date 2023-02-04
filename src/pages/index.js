
import { Inter } from '@next/font/google';
import { Grid } from '@mui/material';
import {Typography} from '@mui/material';
import ButtonNew from '@/components/ButtomNew';
import GridSolicitacoes from '@/components/GridSolicitacoes';
import GridCotacoes from '@/components/GridCotacoes';
import GridAutorizados from '@/components/GridAutorizados';
import GridLancamentos from '@/components/GridLancamentos';
const inter = Inter({ subsets: ['latin'] })
import Loading from '@/components/Loading';
import { useContext, useEffect, useState } from 'react';
import { DadosContext } from '@/context/dadosContext';

export default function Home() {
  const [openloading, setOpenloading] = useState(false);
  const{loading, setLoading} = useContext(DadosContext);

  useEffect(()=>{
    console.log('chamou ', loading)
    setOpenloading(loading)
  },[loading]);

  return (
    <>
    <Loading open={openloading} close={()=>setOpenloading(false)}/>
    <ButtonNew mt={2}/>
    <Grid container mt={2} spacing={2}>
        <Grid item xs={3} sx={{ borderRight: 1, p: 2}}>
          <Typography variant="h5" align='center' pb={2}>
            COTAR
          </Typography>
             <GridSolicitacoes/>
        </Grid>
        <Grid item xs={3} sx={{ borderRight: 1, p: 2}}>
        <Typography variant="h5" align='center' pb={2}>
          AUTORIZAR
         </Typography>
        <GridCotacoes/>
        </Grid>
        <Grid item xs={3} sx={{ borderRight: 1, p: 2}}>
        <Typography variant="h5" align='center' pb={2}>
          LANÇAMENTO
         </Typography>
         <GridAutorizados/>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h5" align='center' pb={2}>
          ENTREGA
         </Typography>
         <GridLancamentos />
        </Grid>
    </Grid>
   
    </>
  )
}
