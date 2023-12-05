import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';

const Lobby = () => {
	const navigate = useNavigate();
	const { data, sendRequest } = useApi();
	const { id: lobbyId } = useParams();

	const showUsersInLobby = () => {
		sendRequest({ url: `/lobby/${lobbyId}`, method: 'GET' });
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
			showUsersInLobby(lobbyId);
		}
	}, []);

	return (
		<div>
			<h1>Lobby</h1>
			{data ? (
				<div>
					<button onClick={leaveLobby}>Leave</button>
					<h2>Игроки</h2>
					{JSON.stringify(data)}
				</div>
			) : (
				<div>Загрузка данных...</div>
			)}
		</div>
	);
};

export default Lobby;
