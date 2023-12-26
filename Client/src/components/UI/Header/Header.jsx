import React from 'react';
import logo from '../../../assets/img/logo.png';
import GameButton from '../../UI/Buttons/GameButton';
import styles from './Header.module.css';

function Header() {
	return (
		<header>
			<img className={styles.logo} src={logo} alt='logo' />
			<GameButton>Правила</GameButton>
		</header>
	);
}

export default Header;
