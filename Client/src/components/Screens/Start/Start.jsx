import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameButton from '../../UI/Buttons/GameButton';
import styles from './Start.module.css';

import logo from '../../../assets/img/logo.png';

const Start = () => {
	document.querySelector('.wrapper').className = 'wrapper';
	document.querySelector('.wrapper').className += ' bg-center';
	const navigate = useNavigate();
	return (
		<main>
			<div className={styles.content}>
				<img src={logo} alt='logo' />
				<GameButton
					onClick={() => {
						navigate('/login');
					}}
				>
					Вход
				</GameButton>
				<GameButton
					onClick={() => {
						navigate('/register');
					}}
				>
					Регистрация
				</GameButton>
			</div>
		</main>
	);
};

export default Start;
