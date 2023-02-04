
import { getUsers} from '@/services/users';


export default async (req, res) => {
  try {
        const resposta = await getUsers(req.body)
        if(resposta instanceof Error) throw new Error(resposta)
        res.status(200).send(resposta)
  } catch ( error ) {
    console.log(error.message)
      res.status(401).send(error.message)
  }
}

