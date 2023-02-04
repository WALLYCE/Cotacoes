import NavBar from "./NavBar";
import { DadosContextProvider } from "@/context/dadosContext";
import { useRouter } from "next/router";
import { AuthContextProvider } from "@/context/authContext";
export default function MainContainer({children}, {router}){
  
    const { asPath } = useRouter()

    return(
        <div >
        <DadosContextProvider>
        <AuthContextProvider>
        {asPath != '/login' && <NavBar/>}
            <div style={{marginTop: "10px"}}>
                {children}
            </div>
            </AuthContextProvider>
        </DadosContextProvider>
        
        </div>
    )
}