import React from 'react';
import styles from './LobbyItem.module.css';

import GameButtonIco from '../Buttons/GameButtonIco';
import { ReactComponent as Return } from '../../../assets/icons/return.svg';
import { ReactComponent as Lock } from '../../../assets/icons/lock.svg';

function LobbyItem({ title, userCount, gameId, onButtonClick, hasPassword }) {
	return (
		<div className={`${styles.gameItem} game-label`} key={gameId}>
			<span>
				{title}
				{hasPassword ? <Lock className={styles.lock} /> : null}
			</span>

			<div className={styles.right}>
				<span>{userCount} / 4</span>
				<GameButtonIco Ico={Return} onClick={onButtonClick}></GameButtonIco>
			</div>
		</div>
	);
}

export default LobbyItem;
