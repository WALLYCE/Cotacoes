import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from '../styles/Card.module.css'
import ButtonVisualisarRecusado from './ButtonVisualizarRecusado';
import format from 'date-fns/format';
const card = (
  <React.Fragment>

  </React.Fragment>
);

export default function CardRecusados(props) {
  return (
    <Box sx={{ minWidth: '100%', boxShadow: 3}}>
      <Card variant="outlined">
      <CardContent sx={{p: 0}}>
      <Typography component="div" className={styles.pedido}>
       Solicitacão {props.dados.solicitacao.id_solicitacao}
      </Typography>
      <Typography sx={{ mb: 1.5, marginTop: 1 }} className={styles.descricao}>
      {props.dados.solicitacao.produto}
      </Typography>
    </CardContent>
    <Typography align='center'>
    <ButtonVisualisarRecusado dados={props.dados} />
    </Typography>
    <Typography className={styles.temporizador} mt={2}>
      Recusado
    </Typography>
      </Card>
    </Box>
  );
}