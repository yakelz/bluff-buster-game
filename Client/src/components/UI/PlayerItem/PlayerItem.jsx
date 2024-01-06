import React from 'react';
import PlayerRank from '../PlayerRank/PlayerRank';
import styles from './PlayerItem.module.css';
import { ReactComponent as BulletIco } from '../../../assets/icons/bullet.svg';

function PlayerItem({ playerRank, nickname, check_count }) {
	const bullets = Array.from({ length: check_count }, (_, i) => <BulletIco key={i} />);
	return (
		<div className={styles.player}>
			<PlayerRank rank={playerRank} />
			<div className={styles.info}>
				<span>{nickname}</span>
				<span>{bullets}</span>
			</div>
		</div>
	);
}

export default PlayerItem;
