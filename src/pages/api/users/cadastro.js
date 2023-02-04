
import { cadastrarUsuario } from '@/services/users';


export default async (req, res) => {
  try {
        const user = await cadastrarUsuario(req.body)
        if(user instanceof Error) throw new Error(user.message)
        res.status(200).send(user)
  } catch ( error ) {
    console.log(error)
      res.status(400).send(error.message)
  }
}

