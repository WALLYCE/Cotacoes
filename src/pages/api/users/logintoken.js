
import { validaToken } from '@/services/users';


export default async (req, res) => {
  try {
        const result = await validaToken(req.body.token)
        res.status(200).send(result)
  } catch ( error ) {
      console.log( error );
      res.status(400).send(error)
  }
}

