import { getEntregues } from "@/services/entrega";

export default async (req, res) =>{
 try{
    const result = await getEntregues(req.body)
    if(result instanceof Error) throw new Error(result.message)
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error.message)
 }
}