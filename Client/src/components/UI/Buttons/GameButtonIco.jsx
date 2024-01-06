import React from 'react';
import styles from './GameButton.module.css';

function GameButtonIco({ Ico, onClick, style = '', ...props }) {
	return (
		<button className={`${styles.button} ${style}`} onClick={onClick} {...props}>
			<span>
				<Ico />
			</span>
		</button>
	);
}

export default GameButtonIco;
