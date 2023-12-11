import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Game.module.css';
import useApi from '../../../hooks/useApi';
import useCardSelection from '../../../hooks/useCardSelection';
import useCheckerActions from '../../../hooks/useCheckerActions';

const Game = () => {
	const { id: lobbyId } = useParams();
	const { data, sendRequest } = useApi();
	const { sendRequest: sendActionRequest } = useApi();

	const { selectedCards, toggleCardSelection, submitSelectedCards } = useCardSelection(
		data,
		sendActionRequest,
		lobbyId
	);
	const { isChecker, handleCheck, handleDeclineCheck } = useCheckerActions(
		data,
		sendActionRequest,
		lobbyId
	);

	const updateGameInfo = () => {
		sendRequest({
			url: `/game/${lobbyId}`,
			method: 'GET',
		});
	};

	useEffect(() => {
		updateGameInfo();
		const interval = setInterval(updateGameInfo, 5000);
		return () => clearInterval(interval);
	}, []);

	const canPlay =
		data?.gameInfo?.playerID === data?.gameInfo?.currentPlayerID &&
		data?.gameInfo?.checkerID === null;

	const cardOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

	function sortCards(handCards) {
		return handCards.sort((a, b) => {
			let rankA = cardOrder.indexOf(a.rank);
			let rankB = cardOrder.indexOf(b.rank);
			return rankA - rankB;
		});
	}

	const sortedHandCards = data?.handCards ? sortCards(data.handCards) : [];

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

					<h2>Players</h2>
					<ul className={styles.playerList}>
						{data.players.map((player) => (
							<li
								key={player.player_id}
								className={`${styles.player} ${
									player.player_id === data.gameInfo.currentPlayerID ? styles.currentTurn : ''
								}`}
							>
								<span>{player.login}</span>: <span>{player.card_count} cards</span>
							</li>
						))}
					</ul>

					<h2>My Cards</h2>
					<div className={styles.cards}>
						{sortedHandCards.map((card) => (
							<div
								key={card.card_id}
								className={`${styles.card} ${
									canPlay && selectedCards.includes(card.card_id) ? styles.selected : ''
								}`}
								onClick={() => toggleCardSelection(card.card_id, canPlay)}
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
