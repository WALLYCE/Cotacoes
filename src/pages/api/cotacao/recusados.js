import { getCotacoesRecusadas } from "@/services/cotacao";

export default async (req, res) =>{
 try{
    const result = await getCotacoesRecusadas(req.body);
    if(result instanceof Error) throw new Error('erro')
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error)
 }
}

