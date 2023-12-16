import React from 'react';
import styles from './GameButton.module.css';

function GameButton({ children, onClick, ...props }) {
	return (
		<button className={styles.button} onClick={onClick} {...props}>
			<span className='button-label'>{children}</span>
		</button>
	);
}

export default GameButton;
