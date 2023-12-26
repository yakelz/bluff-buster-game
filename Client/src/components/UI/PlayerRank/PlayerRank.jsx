import React from 'react';
import styles from './PlayerRank.module.css';

function PlayerRank({ children }) {
	return (
		<div className={styles.rank}>
			<span>{children}</span>
		</div>
	);
}

export default PlayerRank;
