
import { Login } from '@/services/users';


export default async (req, res) => {
  try {
        const user = await Login(req.body)
        if(user instanceof Error) throw new Error(user)
        res.status(200).send(user)
  } catch ( error ) {
    console.log(error.message)
      res.status(401).send(error.message)
  }
}

