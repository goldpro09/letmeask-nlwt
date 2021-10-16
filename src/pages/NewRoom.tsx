import React, { FormEvent, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { usePalette } from 'react-palette';
import { Toaster } from 'react-hot-toast';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

export function NewRoom() {
	const { user } = useAuth();
	const history = useHistory();
	const [newRoom, setNewRoom] = useState('');

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		if (newRoom.trim() === '') {
			return;
		}

		const roomRef = database.ref('rooms');

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});

		history.push(`/admin/rooms/${firebaseRoom.key}`);
	}

	const url = user?.avatar as string;
	// eslint-disable-next-line
	const { data, loading, error } = usePalette(url);

	return (
		<div id="page-auth">
			<Toaster />
			<aside>
				<img src={illustrationImg} alt="Ilustração perguntas e respostas" />
				<strong>Toda pergunta tem uma resposta.</strong>
				<p>Crie salas de Q&amp;A ao vivo</p>
				<span>
					Feito com a{' '}
					<a
						href="http://www.rocketseat.com.br"
						target="_blank"
						rel="noopener noreferrer"
					>
						Rocketseat
					</a>{' '}
					🚀
				</span>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="Letmeask logo" />
					<h2>Crie uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							type="text"
							placeholder="Nome da sala"
							onChange={(event) => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type="submit">Criar sala</Button>
					</form>
					<p>
						Quer entrar em uma sala existente? <Link to="/">Clique aqui!</Link>
					</p>
				</div>
			</main>
			<div className="profile">
				<span style={{ color: data.vibrant }}>{user?.name}</span>
				<img src={user?.avatar} alt="Avatar" style={{ color: data.vibrant }} />
			</div>
		</div>
	);
}
