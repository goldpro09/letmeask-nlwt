import { FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router';

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { usePalette } from 'react-palette';

import '../styles/room.scss';


type FirebaseQuestions = Record<string, {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setnewQuestion] = useState('');
  const [ questions, setQuestions ] = useState<Question[]>([]);
  const [ title, setTitle ] = useState('');

  const roomId = params.id;

  useEffect(()=>{
    if(user?.name !== undefined) {
      toast.success(`Bem vindo ${user?.name}!`, {icon: '👋'});
    } else {
      toast.success('Bem vindo!', {icon: '👋'});
    }
  
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room =>{
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      });

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
      
    })
  }, [roomId]);
  
  async function handleSendQuestion (event: FormEvent) {
    event.preventDefault();

    if(newQuestion.trim() === '') {
      return;
    }

    if(!user) {
      toast.error('Voce deve estar logado!');
    }

    const question = { 
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false
     };

     await database.ref(`rooms/${roomId}/questions`).push(question);

     setnewQuestion('');
  }

  let url = user?.avatar as string;
  // eslint-disable-next-line
  const { data, loading, error } = usePalette(url); 

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo-letmeask" />
          <RoomCode code={roomId}/>
          <Toaster />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala "{title}"</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que deseja perguntar?"
            onChange={event => setnewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} style={{color: data.vibrant}}/>
                <span style={{color: data.vibrant}}>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)};
      </main>
    </div>

  )
}