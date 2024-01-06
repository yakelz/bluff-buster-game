import React from 'react';
import styles from './LobbyItem.module.css';

import GameButtonIco from '../Buttons/GameButtonIco';
import { ReactComponent as Return } from '../../../assets/icons/return.svg';

function LobbyItem({ title, userCount, gameId, onButtonClick }) {
	return (
		<div className={`${styles.gameItem} game-label`} key={gameId}>
			<span>{title}</span>

			<div className={styles.right}>
				<span>{userCount} / 4</span>
				<GameButtonIco Ico={Return} onClick={onButtonClick}></GameButtonIco>
			</div>
		</div>
	);
}

export default LobbyItem;
