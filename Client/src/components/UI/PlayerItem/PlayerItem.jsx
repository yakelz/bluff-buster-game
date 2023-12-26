import React from 'react';
import PlayerRank from '../PlayerRank/PlayerRank';
import styles from './PlayerItem.module.css';

function PlayerItem({ playerRank, nickname, check_count }) {
	return (
		<div className={styles.player}>
			<PlayerRank>{playerRank}</PlayerRank>
			<div className={styles.info}>
				<span>{nickname}</span>
				<span>{check_count}</span>
			</div>
		</div>
	);
}

export default PlayerItem;
