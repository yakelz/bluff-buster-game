import React from 'react';
import { ReactComponent as Cup } from '../../../assets/icons/cup.svg';
import styles from './WinCount.module.css';

function WinCount({ count }) {
	return (
		<div className={styles.count}>
			<span>{count}</span>
			<Cup />
		</div>
	);
}

export default WinCount;
