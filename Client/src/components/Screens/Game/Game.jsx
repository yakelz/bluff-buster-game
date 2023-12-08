import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
const Ratings = () => {
	const { id: lobbyId } = useParams();
	const { data, sendRequest } = useApi();

	const updateGameInfo = () => {
		sendRequest({ url: `/game/${lobbyId}`, method: 'GET' });
	};

	useEffect(() => {
		updateGameInfo();
		const interval = setInterval(() => {
			updateGameInfo();
		}, 5000);

		// Очистка интервала при размонтировании компонента
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<h1>Game</h1>
			lobby_id: {lobbyId}
			{JSON.stringify(data)}
		</div>
	);
};

export default Ratings;
