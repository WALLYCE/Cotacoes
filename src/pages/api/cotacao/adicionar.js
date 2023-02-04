import { NovaCotacao } from "@/services/cotacao";

export default async (req, res) =>{
 try{
    const result = await NovaCotacao(req.body)
    if(result instanceof Error) throw new Error(result.message)
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error.message)
 }
}