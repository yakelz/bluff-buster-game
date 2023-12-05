import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

const Lobby = () => {
	const [data, setData] = useState(null);
	const navigate = useNavigate();
	const { id: lobbyId } = useParams();

	const showUsersInLobby = async () => {
		try {
			const response = await axios.get(`/lobby/${lobbyId}`);
			setData(response.data);
		} catch (error) {
			console.log('Ошибка при запросе:', error);
		}
	};

	const leaveLobby = async () => {
		try {
			const response = await axios.delete(`/lobby/${lobbyId}`);
			navigate('/');
		} catch (error) {
			console.log('Ошибка при запросе:', error);
		}
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
