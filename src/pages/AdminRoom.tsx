import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { usePalette } from 'react-palette';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  const url = user?.avatar as string;
  // eslint-disable-next-line
  const { data, loading, error } = usePalette(url); 

  useEffect(() => {
    setTimeout(() => {
      if (user?.name !== undefined) {
        toast(`Bem vindo adm ${user?.name}!`, { icon: '👋', style: { background: '#f0ecb9' }, duration: 2000 });
      }
    }, 1500);
  }, [user]);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string, answered: boolean) {
    if (answered) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: false });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: true });
    }
  }
  async function handleHighlightQuestion(questionId: string, highlighted: boolean) {
    if (highlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: false });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: true });
    }
  }
  async function handleDeleteQuestion(questionId: string) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Toaster />
          <img src={logoImg} alt="logo-letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>
            Sala "
            <strong>{title}</strong>
            " -
            {' '}
            <strong style={{ color: '#835AFD' }}>ADMINISTRADOR</strong>
          </h1>
          {questions.length > 0 ? (
            <span>
              {questions.length}
              {' '}
              pergunta(s)
            </span>
          ) : <span style={{ background: '#835AFD' }}>Nenhuma pergunta ainda!</span>}

          <span>
            Nº participantes
            {' '}
            {}
          </span>
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              { question.likeCount > 0 && (
                <div className="likes-quantity">
                  <span>{question.likeCount}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}>
                <img src={checkImg} alt="Marcar pergunta como respondida" />
              </button>
              {!question.isAnswered && (
              <button type="button" onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}>
                <img src={answerImg} alt="Destacar a pergunta" />
              </button>
              )}
              <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                <img src={deleteImg} alt="Deletar pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
