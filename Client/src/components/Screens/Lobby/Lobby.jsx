import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';

const Lobby = () => {
	const navigate = useNavigate();
	const { data, sendRequest } = useApi();
	const [isReady, setIsReady] = useState(false);
	const { id: lobbyId } = useParams();

	const showUsersInLobby = () => {
		sendRequest({ url: `/lobby/${lobbyId}`, method: 'GET' });
	};

	const toggleReady = () => {
		const state = !isReady;
		setIsReady(state);
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'PUT',
			payload: { state: state ? 1 : 0 },
		});
	};

	const leaveLobby = () => {
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'DELETE',
			onSuccess: () => navigate('/'),
		});
	};

	useEffect(() => {
		if (lobbyId) {
			showUsersInLobby();
			const interval = setInterval(() => {
				showUsersInLobby();
			}, 5000);

			// Очистка интервала при размонтировании компонента
			return () => clearInterval(interval);
		}
	}, [lobbyId]);

	return (
		<div>
			<h1>Lobby</h1>
			{data ? (
				<div>
					<button onClick={leaveLobby}>Leave</button>
					<h2>Игроки</h2>
					{JSON.stringify(data)}
					<button onClick={toggleReady}>{isReady ? 'Отменить готовность' : 'Готов'}</button>
				</div>
			) : (
				<div>Загрузка данных...</div>
			)}
		</div>
	);
};

export default Lobby;
