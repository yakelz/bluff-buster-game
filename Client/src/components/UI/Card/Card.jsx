import React from 'react';
import styles from './Card.module.css';

import Club from '../../../assets/img/cards/Club.svg';
import Diamonds from '../../../assets/img/cards/Diamonds.svg';
import Hearts from '../../../assets/img/cards/Hearts.svg';
import Spades from '../../../assets/img/cards/Spades.svg';

function Card({ rank, suit, className, onClick }) {
	const suitImages = {
		C: Club,
		D: Diamonds,
		H: Hearts,
		S: Spades,
	};
	const suitImage = suitImages[suit] || Hearts;

	return (
		<div className={`${styles.card} ${className}`} onClick={onClick}>
			<div className={styles.top}>
				<span>{rank}</span>
				<img src={suitImage} alt='suit' />
			</div>
			<div className={styles.center}>
				<span>{rank}</span>
				<img src={suitImage} alt='suit' />
			</div>
		</div>
	);
}

export default Card;
