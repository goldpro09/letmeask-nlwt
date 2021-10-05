import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { database } from "../services/firebase";

import { Button } from "../components/Button";
import '../styles/auth.scss';

import toast, { Toaster } from "react-hot-toast";

export function Home() {
  const history = useHistory();
  const { user, singnInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');
  
  async function handleCreateRoom() {
    if(!user) {
      await singnInWithGoogle();
    }
    history.push('/rooms/new');
    toast.success('Entrou com sucesso!')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim()==='') {
      toast.error('Código de sala vazio!', {style: { background: '#ff3333', color: '#f3f3f3' }});
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      toast.error('Esta sala não existe!');
      return;
    }

    history.push(`rooms/${roomCode}`);
  }
  return (
    <div id="page-auth">
      <Toaster />
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
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala!"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}