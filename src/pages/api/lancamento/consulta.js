import { getLancamentos } from "@/services/lancamento";

export default async (req, res) =>{
 try{
    const result = await getLancamentos(req.body)
    if(result instanceof Error) throw new Error(result.message)
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error.message)
 }
}