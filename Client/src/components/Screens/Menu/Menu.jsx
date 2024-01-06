import React, { useEffect } from 'react';
import useApi from '../../../hooks/useApi';
import styles from './Menu.module.css';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import WinCount from '../../UI/WinCount/WinCount';
import LobbyItem from '../../UI/LobbyItem/LobbyItem';
import { useNavigate } from 'react-router-dom';
import PlayerRank from '../../UI/PlayerRank/PlayerRank';
import { FallingLines } from 'react-loader-spinner';

const Menu = () => {
	const navigate = useNavigate();
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
					<BlurContainer style={styles.userInfo}>
						<div className={styles.userRank}>
							<PlayerRank rank={4} />
							<p>{data.userInfo.login}</p>
						</div>
						<WinCount count={data.userInfo.win_count} />
					</BlurContainer>

					<BlurContainer style={styles.currentGames}>
						<h3>Текущие игры</h3>
						{data.currentGames &&
							data.currentGames.map((game, index) => (
								<LobbyItem
									title='Lobby'
									key={game.id}
									userCount={game.userCount}
									gameId={game.id}
									onButtonClick={() => navigate(`/lobby/${game.id}`)}
								/>
							))}
					</BlurContainer>
				</div>
			)}
		</>
	);
};

export default Menu;
