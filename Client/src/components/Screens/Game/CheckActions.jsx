import React from 'react';
import useApi from '../../../hooks/useApi';
import { useParams } from 'react-router-dom';

const CheckActions = () => {
	const { id: lobbyId } = useParams();
	const { data, sendRequest } = useApi();

	const handleCheck = () => {
		const playerID = data?.gameInfo?.playerID;
		const currentPlayerID = data?.gameInfo?.currentPlayerID;
		sendRequest({
			url: `/game/${lobbyId}/check`,
			method: 'POST',
			payload: {
				checkerID: playerID,
				turnPlayerID: currentPlayerID,
			},
		});
	};

	const handleDeclineCheck = () => {
		const playerID = data?.gameInfo?.playerID;
		const currentPlayerID = data?.gameInfo?.currentPlayerID;

		sendRequest({
			url: `/game/${lobbyId}/decline`,
			method: 'POST',
			payload: {
				checkerID: playerID,
				turnPlayerID: currentPlayerID,
			},
		});
	};

	return (
		<div>
			<button onClick={handleCheck}>Проверить</button>
			<button onClick={handleDeclineCheck}>Отклонить проверку</button>
		</div>
	);
};

export default CheckActions;
