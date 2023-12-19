import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import styles from './Menu.module.css';

import logo from '../../../assets/img/logo.png';
import bg from '../../../assets/img/backgrounds/menu.png';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import GameButton from '../../UI/Buttons/GameButton';
import WinCount from '../../UI/WinCount/WinCount';

const Menu = () => {
	useEffect(() => {
		const wrapper = document.querySelector('.wrapper');
		wrapper.style.backgroundImage = `url(${bg})`;
		wrapper.className = 'wrapper';
		wrapper.className += ' animate';
	}, []);

	const navigate = useNavigate();
	const { data, sendRequest } = useApi();

	const fetchData = () => {
		sendRequest({ url: '/menu', method: 'GET' });
	};

	const logout = () => {
		sendRequest({
			url: '/logout',
			method: 'POST',
			onSuccess: () => window.location.reload(),
		});
	};

	const enterLobby = (lobbyId) => {
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'POST',
			onSuccess: () => navigate(`/lobby/${lobbyId}`),
		});
	};

	useEffect(() => {
		fetchData();
		const interval = setInterval(() => {
			fetchData();
		}, 5000);

		// Очистка интервала при размонтировании компонента
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{!data ? (
				<div>Загрузка данных...</div>
			) : (
				<div className={styles.menu}>
					<header>
						<img className={styles.logo} src={logo} alt='logo' />
						<GameButton>Правила</GameButton>
					</header>
					<Link to='/ratings'>Ratings</Link>
					<Link to='/settings'>Settings</Link>
					<button onClick={logout}>Logout</button>

					<BlurContainer style={styles.userInfo}>
						<p>{data.userInfo.login}</p>
						<WinCount count={data.userInfo.win_count} />
					</BlurContainer>

					<BlurContainer>
						<h2>Current Games</h2>
						{data.currentGames &&
							data.currentGames.map((game, index) => (
								<div key={game.id}>
									<p>Lobby ID: {game.id}</p>
									<p>{game.userCount} / 4</p>
									<GameButton
										onClick={() => {
											navigate(`/lobby/${game.id}`);
										}}
									>
										Return
									</GameButton>
								</div>
							))}
					</BlurContainer>

					<BlurContainer>
						<h2>Available Games</h2>
						{data.availableGames &&
							data.availableGames.map((game, index) => (
								<div key={game.lobby_id}>
									<p>Lobby ID: {game.lobby_id}</p>
									<p>Users Count: {game.usersCount}</p>
									<GameButton onClick={() => enterLobby(game.lobby_id)}>Enter</GameButton>
								</div>
							))}
					</BlurContainer>

					<div>
						<h2>Create Lobby</h2>
						<Link to={`/create/`}>Create lobby</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default Menu;
