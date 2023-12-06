import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useApi';

const Menu = () => {
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
		<div>
			<h1>Menu</h1>
			<Link to='/ratings'>Ratings</Link>
			<Link to='/settings'>Settings</Link>
			<button onClick={logout}>Logout</button>

			{data ? (
				<div>
					<div>
						<h2>UserInfo</h2>
						<p>Login: {data.userInfo.login}</p>
						<p>Win Count: {data.userInfo.win_count}</p>
					</div>

					<div>
						<h2>Current Games</h2>
						{data.currentGames.id.map((id, index) => (
							<div key={id}>
								<p>Lobby ID: {id}</p>
								<p>Users Count: {data.currentGames.userCount[index]}</p>
								<Link to={`/lobby/${id}`}>Return {id}</Link>
							</div>
						))}
					</div>

					<div>
						<h2>Available Games</h2>
						{data.availableGames.lobby_id.map((id, index) => (
							<div key={id}>
								<p>Lobby ID: {id}</p>
								<p>Users Count: {data.availableGames.usersCount[index]}</p>
								<button onClick={() => enterLobby(id)}>Enter</button>
							</div>
						))}
					</div>

					<div>
						<h2>Create Lobby</h2>
						<Link to={`/create/`}> Create lobby </Link>
					</div>
				</div>
			) : (
				<div>Загрузка данных...</div>
			)}
		</div>
	);
};

export default Menu;
