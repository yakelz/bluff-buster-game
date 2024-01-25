import React, { useEffect, useState } from 'react';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

import styles from './Search.module.css';
import LobbyItem from '../../UI/LobbyItem/LobbyItem';
import PasswordModal from '../../UI/PasswordModal/PasswordModal';

import { FallingLines } from 'react-loader-spinner';
import GameButton from '../../UI/Buttons/GameButton';

function Search() {
	const { data, sendRequest } = useApi();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedLobby, setSelectedLobby] = useState(null);

	const enterLobby = (lobbyId, password = null) => {
		sendRequest({
			url: `/lobby/${lobbyId}`,
			payload: { password },
			method: 'POST',
			onSuccess: () => navigate(`/lobby/${lobbyId}`),
		});
	};

	const onLobbyClick = (lobby) => {
		if (lobby.hasPassword) {
			setSelectedLobby(lobby);
			setIsModalOpen(true);
		} else {
			enterLobby(lobby.id);
		}
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
				<main className={styles.mainLoader}>
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
						{data.availableGames && data.availableGames.length === 0 ? (
							<>
								<h3>Доступных игр нет</h3>
								<GameButton
									onClick={() => {
										navigate(`/create`);
									}}
								>
									{' '}
									Создать игру{' '}
								</GameButton>
							</>
						) : (
							<>
								<h3>Список игр</h3>
								{data.availableGames.map((game) => (
									<LobbyItem
										title={`#${game.id} Комната ${game.hostLogin}`}
										key={game.id}
										userCount={game.userCount}
										gameId={game.id}
										onButtonClick={() => onLobbyClick(game)}
										hasPassword={game.hasPassword}
									/>
								))}
							</>
						)}
					</BlurContainer>
				</div>
			)}
			{isModalOpen && (
				<PasswordModal
					onClose={() => setIsModalOpen(false)}
					onConfirm={(password) => {
						enterLobby(selectedLobby.id, password);
						setIsModalOpen(false);
					}}
				/>
			)}
		</>
	);
}

export default Search;
