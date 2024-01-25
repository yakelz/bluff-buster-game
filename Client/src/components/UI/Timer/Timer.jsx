import React, { useEffect, useState } from 'react';
import styles from './Timer.module.css';
import { ReactComponent as HourglassIcon } from '../../../assets/icons/timer.svg';

const Timer = ({ duration, state, playerName }) => {
	const [secondsLeft, setSecondsLeft] = useState(duration);

	useEffect(() => {
		setSecondsLeft(duration);
	}, [duration]);

	return (
		<div className={styles.timerContainer}>
			<HourglassIcon className={styles.hourglassIcon} />
			<div className={styles.countdown}>
				{state === 1 ? <span> Проверка: {playerName}</span> : <span> Ход: {playerName}</span>}
				<span>Время: {secondsLeft}</span>
			</div>
		</div>
	);
};

export default Timer;
