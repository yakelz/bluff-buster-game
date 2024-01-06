import React, { useEffect } from 'react';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

import styles from './Search.module.css';
import LobbyItem from '../../UI/LobbyItem/LobbyItem';

import { FallingLines } from 'react-loader-spinner';

function Search() {
	const { data, sendRequest } = useApi();
	const navigate = useNavigate();

	const enterLobby = (lobbyId) => {
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'POST',
			onSuccess: () => navigate(`/lobby/${lobbyId}`),
		});
	};

	const fetchData = () => {
		sendRequest({ url: '/search', method: 'GET' });
		console.log(data);
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
				<main>
					<FallingLines
						color='white'
						width='100'
						visible={true}
						ariaLabel='falling-circles-loading'
					/>
				</main>
			) : (
				<div className={styles.menu}>
					<BlurContainer style={styles.games}>
						<h3>Список игр</h3>
						{data.availableGames &&
							data.availableGames.map((game, index) => (
								<LobbyItem
									title='Lobby'
									key={game.id}
									userCount={game.userCount}
									gameId={game.id}
									onButtonClick={() => {
										enterLobby(game.id);
									}}
								/>
							))}
					</BlurContainer>
				</div>
			)}
		</>
	);
}

export default Search;
