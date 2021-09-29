import { useHistory } from "react-router-dom";
import { auth, firebase } from '../services/firebase'

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from "../components/Button";
import '../styles/auth.scss';


export function Home() {
  const history = useHistory();
  
  function handleCreateRoom() {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then(result=>{
      console.log(result);

      history.push('./rooms/new');
    })

  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração perguntas e respostas" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Crie salas de Q&amp;A ao vivo</p>
        <span>Feito com a <a href="http://www.rocketseat.com.br" target="_blank" rel="noopener noreferrer">Rocketseat</a> 🚀</span>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Google icon" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form>
            <input 
              type="text" 
              placeholder="Digite o código da sala!"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}