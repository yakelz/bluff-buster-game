import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Game.module.css';
import useApi from '../../../hooks/useApi';
import bg from '../../../assets/img/backgrounds/game.png';
import useCardSelection from '../../../hooks/useCardSelection';
import useCheckerActions from '../../../hooks/useCheckerActions';
import Card from '../../UI/Card/Card';
import PlayerItem from '../../UI/PlayerItem/PlayerItem';
import PlayersCards from '../../UI/PlayersCards/PlayersCards';
import GameButtonIco from '../../UI/Buttons/GameButtonIco';

import backCard from '../../../assets/img/cards/Back.png';

import { ReactComponent as BackIco } from '../../../assets/icons/back.svg';
import { ReactComponent as MusicIco } from '../../../assets/icons/music.svg';
import { ReactComponent as QuestionIco } from '../../../assets/icons/question.svg';
import { ReactComponent as AutoplayIco } from '../../../assets/icons/autoplay.svg';

import GameButton from '../../UI/Buttons/GameButton';
import ClickWrapper from '../../UI/Buttons/ClickWrapper';
import { FallingLines } from 'react-loader-spinner';
import Timer from '../../UI/Timer/Timer';

const Game = () => {
	useEffect(() => {
		const wrapper = document.querySelector('.wrapper');
		wrapper.style.padding = '0';
		wrapper.style.backgroundImage = `url(${bg})`;
		wrapper.className = 'wrapper';

		// wrapper.className += ' animate';
	}, []);

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
		const interval = setInterval(updateGameInfo, 2000);
		return () => clearInterval(interval);
	}, []);

	// Текущий ход у пользователя?
	const canPlay =
		data?.gameInfo?.playerID === data?.gameInfo?.currentPlayerID &&
		data?.gameInfo?.checkerID === null &&
		data?.gameInfo?.isConfirming !== 1;

	// Сортировка карт
	const cardOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

	function sortCards(handCards) {
		return handCards.sort((a, b) => {
			let rankA = cardOrder.indexOf(a.rank);
			let rankB = cardOrder.indexOf(b.rank);
			return rankA - rankB;
		});
	}

	const sortedHandCards = data?.handCards ? sortCards(data.handCards) : [];

	const getCardsPlayedCountText = (count) => {
		switch (count) {
			case 1:
				return 'одну';
			case 2:
				return 'две';
			case 3:
				return 'три';
			case 4:
				return 'четыре';
			default:
				return '';
		}
	};
	// Чтобы игрок пользователя находился снизу
	const index = data?.players?.findIndex((player) => player.player_id === data?.gameInfo?.playerID);
	const shiftCount = (index + data?.players?.length) % data?.players?.length;
	for (let i = 0; i < shiftCount; i++) {
		data?.players?.push(data?.players?.shift());
	}

	// Найти игрока текущего хода
	const currentPlayer = data?.players?.find(
		(player) => player.player_id === data.gameInfo.currentPlayerID
	);

	const checkerPlayer = data?.players?.find(
		(player) => player.player_id === data.gameInfo.checkerID
	);

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
				<main>
					{/* Кнопки в интерфейсе */}
					<div className={styles.buttons}>
						<div className={styles.buttonGroup}>
							<GameButtonIco Ico={BackIco} onClick={() => {}} />
							<GameButtonIco Ico={MusicIco} onClick={() => {}} />
						</div>
						<div className={styles.buttonGroup}>
							<GameButtonIco Ico={QuestionIco} onClick={() => {}} />
							<GameButtonIco Ico={AutoplayIco} onClick={() => {}} />
						</div>
					</div>

					{/* Карточки игроков */}
					<div className={styles.playersContainer}>
						<ul className={styles.playerList}>
							{data.players.map((player) => (
								<li
									key={player.player_id}
									className={`${styles.player} ${
										player.player_id === data.gameInfo.currentPlayerID ? styles.currentTurn : ''
									}`}
								>
									<PlayerItem playerRank={5} nickname={player.login} check_count='3' />
								</li>
							))}
						</ul>
					</div>

					{/* Карты игроков */}
					<PlayersCards playerID={data.gameInfo.playerID} playersData={data.players} />

					{/* Игровая информация (по середине экрана) */}
					<div className={styles.game__info}>
						{/* Таймер */}
						<Timer duration={20} playerName={currentPlayer.login} />
						{data.gameInfo.cardsOnTableCount >= 0 && (
							<>
								{data.turnCards ? (
									<>
										{/* Кол-во сыгранных карт за текущий ход */}
										<div className={styles.turn__cards}>
											{data.turnCards.map((card) => (
												<Card key={card.card_id} rank={card.rank} suit={card.suit} />
											))}
										</div>
									</>
								) : (
									<>
										{/* Кол-во сыгранных карт за текущий ход */}
										<div className={styles.turn__cards}>
											{Array.from({ length: data.gameInfo.cardsPlayedCount }, (_, index) => (
												<img key={index} src={backCard} alt='Обложка карты' />
											))}
										</div>
									</>
								)}
								{/* Кол-во сыгранных карт */}
								<span className={styles.counter}>
									{data.gameInfo.cardsOnTableCount + data.gameInfo.cardsPlayedCount}
								</span>

								{/* Информация о ходе */}
								{data.turnCards ? (
									<>
										<div className={styles.info__title}>
											<span>
												{checkerPlayer ? checkerPlayer.login : 'Неизвестный игрок'} проверяет{' '}
												{currentPlayer ? currentPlayer.login : 'Неизвестного игрока'}
											</span>
										</div>
									</>
								) : (
									<>
										{data.gameInfo.cardsPlayedCount > 0 && (
											<div className={styles.info__title}>
												<span>
													{currentPlayer ? currentPlayer.login : 'Неизвестный игрок'} положил{' '}
													{getCardsPlayedCountText(data.gameInfo.cardsPlayedCount)}{' '}
													<strong>{data.gameInfo.currentRank}</strong>
												</span>
											</div>
										)}
									</>
								)}
							</>
						)}

						{isChecker && (
							<ClickWrapper initState={false}>
								<GameButton onClick={handleCheck}>Проверить</GameButton>
								<GameButton onClick={handleDeclineCheck}>Отклонить проверку</GameButton>
							</ClickWrapper>
						)}
						{canPlay && (
							<ClickWrapper initState={false}>
								<GameButton onClick={submitSelectedCards}>
									Сыграть {getCardsPlayedCountText(selectedCards.length)}{' '}
									{data.gameInfo.currentRank}
								</GameButton>
							</ClickWrapper>
						)}
					</div>

					{/* Карты пользователя*/}
					<div className={styles.cards}>
						{sortedHandCards.map((card) => (
							<Card
								key={card.card_id}
								rank={card.rank}
								suit={card.suit}
								className={
									canPlay && selectedCards.includes(card.card_id)
										? `${styles.card} ${styles.cardSelected}`
										: styles.card
								}
								onClick={() => toggleCardSelection(card.card_id, canPlay)}
							/>
						))}
					</div>
				</main>
			)}
		</>
	);
};

export default Game;
