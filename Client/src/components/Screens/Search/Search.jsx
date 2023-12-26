import React, { useEffect } from 'react';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import GameButton from '../../UI/Buttons/GameButton';

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
		sendRequest({ url: '/menu', method: 'GET' });
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
		<div>
			Search
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
		</div>
	);
}

export default Search;
