
import { Inter } from '@next/font/google';
import { Grid, Typography } from '@mui/material';
import GridRecusados from '@/components/GridRecusados';


export default function recusados() {
  return (
    <>
    <Grid container mt={2} spacing={2}>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        <Typography variant="h5" align='center' pb={2}>
            SOLICITAÇÕES RECUSADAS
          </Typography>
          <GridRecusados/>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, p: 2}}>
        </Grid>
    </Grid>
   
    </>
  )
}
