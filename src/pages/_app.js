import MainContainer from "@/components/MainContainer";
import styles from '../styles/Globals.module.css';
export default function App({ Component, pageProps }) {
  return ( 
  <MainContainer className={styles.background} > 
    <Component {...pageProps} />
  </MainContainer> )
}
