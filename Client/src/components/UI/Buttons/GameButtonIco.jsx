import React from 'react';
import styles from './GameButton.module.css';

function GameButtonIco({ Ico, onClick, ...props }) {
	return (
		<button className={styles.button} onClick={onClick} {...props}>
			<span>
				<Ico />
			</span>
		</button>
	);
}

export default GameButtonIco;
