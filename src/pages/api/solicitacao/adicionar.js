import { NovaSolicitacao } from "@/services/solicitacao";

export default async (req, res) =>{
 try{
    const result = await NovaSolicitacao(req.body)
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error)
 }
}