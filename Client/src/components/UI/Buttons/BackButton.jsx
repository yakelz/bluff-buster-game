import React from 'react';
import styles from './GameButton.module.css';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIco } from '../../../assets/icons/back.svg';

function BackButton() {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	return (
		<button className={`${styles.button} ${styles.button__ico} `} onClick={goBack}>
			<span>
				<BackIco />
			</span>
		</button>
	);
}

export default BackButton;
