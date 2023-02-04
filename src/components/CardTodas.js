import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from '../styles/Card.module.css'
import Moment from 'react-moment';
import ButtonDelete from './ButtonDelete';

export default function CardTodas(props) {
  return (
    <div>
    <Box sx={{ minWidth: '100%', boxShadow: 3}}>
      <Card variant="outlined">
      <CardContent sx={{p: 0}}>
      <Typography className={styles.pedido}>
       Solicitacão {props.dados.id_solicitacao}
      </Typography>
      <Typography sx={{ mb: 1.5, marginTop: 1 }} className={styles.descricao}>
      {props.dados.produto}
      </Typography>
    </CardContent>
    <Typography component='div' align='center'>
    <ButtonDelete dados={props.dados} />
    </Typography>
    <Typography className={styles.temporizador} mt={2}>
    --
    </Typography>
      </Card>
    </Box>
    </div>
  );
}