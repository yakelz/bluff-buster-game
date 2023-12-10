import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { setLobbySettings } from '../../../redux/lobby/lobbySlice';

const Lobby = () => {
	const navigate = useNavigate();
	const { data, sendRequest } = useApi();
	const [isReady, setIsReady] = useState(false);
	const { id: lobbyId } = useParams();
	const userID = useSelector((state) => state.auth.userID);
	const [isHost, setIsHost] = useState(false);
	const [allReady, setAllReady] = useState(false);

	const dispatch = useDispatch();

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
		if (data && data.usersInLobby && data.host && userID) {
			const userIndex = data.usersInLobby.findIndex((user) => user.user_id === userID);
			if (userIndex !== -1) {
				setIsReady(data.usersInLobby[userIndex].is_ready === 1);
			}

			// Проверяем, является ли пользователь хостом
			setIsHost(data.host.host_id === userID);

			if (isHost) {
				dispatch(setLobbySettings(data.lobbySettings));
			}

			// Проверяем, готовы ли все игроки
			const areAllPlayersReady = data.usersInLobby.every((user) => user.is_ready === 1);
			const isLobbyFull = data.usersInLobby.length === 4;
			setAllReady(areAllPlayersReady && isLobbyFull);
		}
	}, [data, userID, dispatch, isHost]);

	return (
		<>
			{!data ? (
				<div>Загрузка данных...</div>
			) : (
				<>
					<h1>Lobby</h1>
					<button onClick={leaveLobby}>Leave</button>
					<h2>Игроки</h2>
					<ul>
						{data.usersInLobby &&
							data.usersInLobby.map((user, index) => (
								<li key={user.login}>
									{data.host && data.host.host_id === user.user_id && <span> (host)</span>}
									{user.login} - Побед: {user.win_count}
									<input type='checkbox' checked={user.is_ready === 1} disabled />
								</li>
							))}
					</ul>

					<div>
						{data.lobbySettings && (
							<>
								{data.lobbySettings.hasPassword === 0 ? 'Без пароля' : 'С паролем'}
								<p>Время на ход: {data.lobbySettings.turn_time}</p>
								<p>Время на проверку: {data.lobbySettings.check_time}</p>
							</>
						)}
						<button onClick={toggleReady}>{isReady ? 'Отменить готовность' : 'Готов'}</button>
						{isHost && (
							<Link to={`/lobby/${lobbyId}/settings`}>Изменить настройки лобби {lobbyId}</Link>
						)}
						{isHost && allReady && <button onClick={startGame}>Начать игру</button>}
					</div>
				</>
			)}
		</>
	);
};

export default Lobby;
