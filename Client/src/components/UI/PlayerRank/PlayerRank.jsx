import React from 'react';
import styles from './PlayerRank.module.css';

function PlayerRank({ rank }) {
	if (!Number.isInteger(rank)) {
		console.error('Rank must be an integer');
		return null;
	}

	let rankClass = styles.other;
	switch (rank) {
		case 1:
			rankClass = styles.first;
			break;
		case 2:
			rankClass = styles.second;
			break;
		case 3:
			rankClass = styles.third;
			break;
		default:
			break;
	}

	return (
		<div className={`${styles.rank} ${rankClass}`}>
			<span>{rank}</span>
		</div>
	);
}

export default PlayerRank;
