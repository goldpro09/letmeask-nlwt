import { Link } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { Button } from "../components/Button";

export function NewRoom() {
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
          <h2>Crie uma nova sala</h2>
          <form>
            <input 
              type="text" 
              placeholder="Nome da sala"
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to='/'>Clique aqui!</Link></p>
        </div>
      </main>
      <div className="profile">
        <img src="" alt="Avatar" />
        <span>Nome</span>
      </div>
    </div>
  );
}