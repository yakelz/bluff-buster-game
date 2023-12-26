import React, { useEffect } from 'react';
import useApi from '../../../hooks/useApi';
import styles from './Menu.module.css';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import WinCount from '../../UI/WinCount/WinCount';
import LobbyItem from '../../UI/LobbyItem/LobbyItem';

const Menu = () => {
	const { data, sendRequest } = useApi();

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
		<>
			{!data ? (
				<div>Загрузка данных...</div>
			) : (
				<div className={styles.menu}>
					<BlurContainer style={styles.userInfo}>
						<p>{data.userInfo.login}</p>
						<WinCount count={data.userInfo.win_count} />
					</BlurContainer>

					<BlurContainer style={styles.currentGames}>
						<h3>Текущие игры</h3>
						{data.currentGames &&
							data.currentGames.map((game, index) => (
								<LobbyItem title='Lobby' userCount={game.userCount} gameId={game.id} />
							))}
					</BlurContainer>
				</div>
			)}
		</>
	);
};

export default Menu;
