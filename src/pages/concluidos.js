
import { Inter } from '@next/font/google';
import { Grid, Typography } from '@mui/material';
import GridConcluidos from '@/components/GridConcluidos';


export default function concluidos() {
  return (
    <>
    <Grid container mt={2} spacing={2}>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        <Typography variant="h5" align='center' pb={2}>
            SOLICITAÇÕES CONCLUÍDAS
          </Typography>
          <GridConcluidos/>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        </Grid>
    </Grid>
   
    </>
  )
}
