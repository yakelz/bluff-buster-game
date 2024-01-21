import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { setLobbySettings } from '../../../redux/lobby/lobbySlice';
import Header from '../../UI/Header/Header';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import GameButtonIco from '../../UI/Buttons/GameButtonIco';
import { ReactComponent as BackIco } from '../../../assets/icons/back.svg';
import styles from './Lobby.module.css';
import LobbyPlayer from '../../UI/LobbyPlayer/LobbyPlayer';
import GameButton from '../../UI/Buttons/GameButton';
import { FallingLines } from 'react-loader-spinner';

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
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'GET',
			onSuccess: (responseData) => {
				if (responseData && responseData.state) {
					navigate(`/game/${lobbyId}`);
				}
			},
		});
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
			console.log(`All Ready: ${areAllPlayersReady} isLobbyFull ${isLobbyFull}`);
			console.log(data.usersInLobby);
			setAllReady(areAllPlayersReady && isLobbyFull);
		}
	}, [data, userID, dispatch, isHost]);

	// Находим Nickname хоста
	const hostNickname = data?.usersInLobby?.find(
		(user) => user.user_id === data?.host?.host_id
	)?.login;

	return (
		<main>
			{!data ? (
				<main>
					<FallingLines
						color='white'
						width='100'
						visible={true}
						ariaLabel='falling-circles-loading'
					/>
				</main>
			) : (
				<>
					<Header />
					<BlurContainer style={styles.lobby}>
						<div className={styles.title}>
							<GameButtonIco Ico={BackIco} onClick={leaveLobby} />
							<h3>Комната игрока {hostNickname}</h3>
						</div>
						<ul className={styles.players}>
							{data.usersInLobby &&
								data.usersInLobby.map((user, index) => (
									<LobbyPlayer
										key={user.login}
										rank={2}
										nickname={user.login}
										winCount={user.win_count}
										check={user.is_ready === 1}
										isHost={data.host && data.host.host_id === user.user_id}
									/>
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
							<div className={styles.buttons}>
								{!isHost && (
									<GameButton onClick={toggleReady}>
										{isReady ? 'Отменить готовность' : 'Готов'}
									</GameButton>
								)}
								{isHost && (
									<GameButton
										onClick={() => {
											navigate(`/lobby/${lobbyId}/settings`);
										}}
									>
										Изменить настройки
									</GameButton>
								)}
							</div>
							{isHost && allReady && <GameButton onClick={startGame}>Начать игру</GameButton>}
						</div>
					</BlurContainer>
				</>
			)}
		</main>
	);
};

export default Lobby;
