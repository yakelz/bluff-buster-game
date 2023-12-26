import React from 'react';
import backCard from '../../../assets/img/cards/Back.png';
import styles from './PlayersCards.module.css';

function PlayersCards({ playerID, playersData }) {
	return (
		<div className={styles.playersCardsContainer}>
			<ul className={styles.playerCardsList}>
				{playersData.map((player) => (
					<li key={player.player_id} className={styles.player}>
						{player.player_id !== playerID && (
							<div className={styles.card}>
								{Array.from({ length: player.card_count }, (_, index) => (
									<img key={index} src={backCard} alt='Обложка карты' />
								))}
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default PlayersCards;
