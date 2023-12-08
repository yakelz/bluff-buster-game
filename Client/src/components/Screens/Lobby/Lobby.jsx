import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { useSelector } from 'react-redux';

const Lobby = () => {
	const navigate = useNavigate();
	const { data, sendRequest } = useApi();
	const [isReady, setIsReady] = useState(false);
	const { id: lobbyId } = useParams();
	const userID = useSelector((state) => state.auth.userID);
	const [isHost, setIsHost] = useState(false);
	const [allReady, setAllReady] = useState(false);

	const getLobbyInfo = () => {
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

	const startGame = () => {
		sendRequest({
			url: `/game/${lobbyId}`,
			method: 'POST',
			onSuccess: () => navigate(`/game/${lobbyId}`),
		});
	};

	useEffect(() => {
		if (lobbyId) {
			getLobbyInfo();
			const interval = setInterval(() => {
				getLobbyInfo();
			}, 5000);

			// Очистка интервала при размонтировании компонента
			return () => clearInterval(interval);
		}
	}, [lobbyId]);

	useEffect(() => {
		if (data && data.usersInLobby && userID) {
			const userIndex = data.usersInLobby.user_id.findIndex((id) => id === userID);
			if (userIndex !== -1) {
				setIsReady(data.usersInLobby.is_ready[userIndex]);
			}
			// Проверяем, является ли пользователь хостом
			if (data.host && data.host.host_id.includes(userID)) {
				setIsHost(true);
			} else {
				setIsHost(false);
			}

			// Проверяем, готовы ли все игроки
			const areAllPlayersReady = data.usersInLobby.is_ready.every((status) => status === 1);
			const isLobbyFull = data.usersInLobby.user_id.length === 4;
			setAllReady(areAllPlayersReady && isLobbyFull);
		}
	}, [data, userID]);

	return (
		<div>
			<h1>Lobby</h1>
			{data && data.usersInLobby ? (
				<div>
					<button onClick={leaveLobby}>Leave</button>
					<h2>Игроки</h2>
					<ul>
						{data.usersInLobby.login.map((login, index) => (
							<li key={login}>
								{data.host && data.host.host_id.includes(data.usersInLobby.user_id[index]) && (
									<span> (host)</span>
								)}
								{login} - Побед: {data.usersInLobby.win_count[index]}
								<input type='checkbox' checked={data.usersInLobby.is_ready[index] === 1} disabled />
							</li>
						))}
					</ul>
					{data.lobbySettings.hasPassword == 0 ? 'Без пароля' : 'С паролем'}
					<p>Время на ход: {data.lobbySettings.turn_time}</p>
					<p>Время на проверку: {data.lobbySettings.check_time}</p>
					<button onClick={toggleReady}>{isReady ? 'Отменить готовность' : 'Готов'}</button>
					{isHost && (
						<Link to={`/lobby/${lobbyId}/settings`}>Изменить настройки лобби {lobbyId}</Link>
					)}
					{isHost && allReady && <button onClick={startGame}>Начать игру</button>}
				</div>
			) : (
				<div>Загрузка данных...</div>
			)}
		</div>
	);
};

export default Lobby;
