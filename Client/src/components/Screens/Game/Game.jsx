import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Game.module.css';
import useApi from '../../../hooks/useApi';
const Game = () => {
	const { id: lobbyId } = useParams();
	const { data, sendRequest } = useApi();
	const { data: actionData, sendRequest: sendActionRequest } = useApi();
	const [selectedCards, setSelectedCards] = useState([]);

	const updateGameInfo = () => {
		sendRequest({ url: `/game/${lobbyId}`, method: 'GET' });
	};

	useEffect(() => {
		updateGameInfo();
		const interval = setInterval(() => {
			updateGameInfo();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const canPlay = data?.gameInfo?.playerID === data?.gameInfo?.currentPlayerID;
	const isChecker = data?.gameInfo?.playerID === data?.gameInfo?.checkerID;

	const toggleCardSelection = (cardId) => {
		if (!canPlay) return;
		setSelectedCards((prevSelected) => {
			const isSelected = prevSelected.includes(cardId);
			if (isSelected) {
				return prevSelected.filter((id) => id !== cardId);
			} else {
				return prevSelected.length < 4 ? [...prevSelected, cardId] : prevSelected;
			}
		});
	};

	const submitSelectedCards = () => {
		const playerID = data?.gameInfo?.playerID;

		const payload = {
			playerID,
			selectedCards,
		};

		sendActionRequest({
			url: `/game/${lobbyId}/`,
			method: 'PUT',
			payload: payload,
		});
	};

	const handleCheck = () => {
		sendActionRequest({
			url: `/game/${lobbyId}/check`,
			method: 'POST',
		});
	};

	const handleDeclineCheck = () => {
		const playerID = data?.gameInfo?.playerID;
		const turnPlayerID = data?.gameInfo?.currentPlayerID;

		sendActionRequest({
			url: `/game/${lobbyId}/decline`,
			method: 'POST',
			payload: {
				checkerID: playerID,
				turnPlayerID: turnPlayerID,
			},
		});
	};

	return (
		<>
			{!data ? (
				<div>Загрузка данных...</div>
			) : (
				<main>
					<h2>Game Info</h2>
					<p>Текущий игрок: {data.gameInfo.currentPlayerID}</p>
					<p>Текущий ранг: {data.gameInfo.currentRank}</p>
					<p>Карт на столе: {data.gameInfo.cardsOnTableCount}</p>
					<p>Сыгранные карты: {data.gameInfo.cardsPlayedCount}</p>
					<p>Следующий игрок: {data.gameInfo.nextPlayerID}</p>
					<p>Проверяющий: {data.gameInfo.checkerID || 'Нет'}</p>
					<p>Результат проверки: {data.gameInfo.checkResult}</p>

					<h2>My Cards</h2>
					<div className='cards'>
						{data.playerCards.map((card) => (
							<div
								key={card.card_id}
								className={`card ${
									canPlay && selectedCards.includes(card.card_id) ? styles.selected : ''
								}`}
								onClick={() => toggleCardSelection(card.card_id)}
							>
								{card.rank} – {card.suit}
							</div>
						))}
					</div>
					{canPlay && <button onClick={submitSelectedCards}>Play Selected Cards</button>}
					{isChecker && (
						<div>
							<button onClick={handleCheck}>Проверить</button>
							<button onClick={handleDeclineCheck}>Отклонить проверку</button>
						</div>
					)}
				</main>
			)}
		</>
	);
};

export default Game;
