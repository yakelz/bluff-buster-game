import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { Link } from 'react-router-dom';

const Menu = () => {
	const [data, setData] = useState(null);

	const fetchData = async () => {
		try {
			const response = await axios.get('/menu');
			setData(response.data);
		} catch (error) {
			console.log('Ошибка при запросе:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<h1>Menu</h1>
			<Link to='/ratings'>Ratings</Link>
			<Link to='/settings'>Settings</Link>
			<Link to='/lobby/1'>Lobby</Link>

			{data ? (
				<div>
					<div>
						<h2>UserInfo</h2>
						<p>Login: {data.userInfo.login}</p>
						<p>Win Count: {data.userInfo.win_count}</p>
					</div>

					<div>
						<h2>Current Games</h2>
						<p>ID: {data.currentGames.id}</p>
					</div>

					<div>
						<h2>Available Games</h2>
						{data.availableGames.lobby_id.map((id, index) => (
							<div key={id}>
								<p>Lobby ID: {id}</p>
								<p>Users Count: {data.availableGames.usersCount[index]}</p>
							</div>
						))}
					</div>
				</div>
			) : (
				<div>Загрузка данных...</div>
			)}
		</div>
	);
};

export default Menu;
