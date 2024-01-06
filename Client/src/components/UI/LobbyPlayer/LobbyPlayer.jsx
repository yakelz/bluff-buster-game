import React from 'react';
import PlayerRank from '../PlayerRank/PlayerRank';
import WinCount from '../WinCount/WinCount';
import Checkbox from '../Checkbox/Checkbox';

import styles from './LobbyPlayer.module.css';

const LobbyPlayer = ({ rank, nickname, winCount, check, isHost }) => {
	return (
		<li className={styles.lobbyPlayer}>
			<PlayerRank rank={rank} />
			<span className='nickname'>{nickname}</span>
			<WinCount count={winCount} />
			<Checkbox checked={check} isHost={isHost} disabled />
		</li>
	);
};

export default LobbyPlayer;
