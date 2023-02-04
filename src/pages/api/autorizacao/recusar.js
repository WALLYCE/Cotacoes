import { recusarCotacao } from "@/services/autorizacao";

export default async (req, res) =>{
 try{
    console.log(req.body)
    const result = await recusarCotacao(req.body)
    if(result instanceof Error) throw new Error(result.message)
    res.status(200).send(result)
 }catch(error){
    res.status(400).send(error.message)
 }
}