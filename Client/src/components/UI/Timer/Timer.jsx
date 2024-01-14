import React, { useEffect, useState } from 'react';
import styles from './Timer.module.css';
import { ReactComponent as HourglassIcon } from '../../../assets/icons/timer.svg';

const Timer = ({ duration, state, playerName }) => {
	const [secondsLeft, setSecondsLeft] = useState(duration);

	useEffect(() => {
		if (secondsLeft > 0) {
			const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
			return () => clearTimeout(timerId);
		}
	}, [secondsLeft]);

	return (
		<div className={styles.timerContainer}>
			<HourglassIcon className={styles.hourglassIcon} />
			<div className={styles.countdown}>
				<span> Ход: {playerName}</span>
				<span>Время: {secondsLeft}</span>
			</div>
		</div>
	);
};

export default Timer;
