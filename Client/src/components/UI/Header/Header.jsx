import React from 'react';
import logo from '../../../assets/img/logo.png';
import styles from './Header.module.css';
import GameButtonIco from '../Buttons/GameButtonIco';

import { ReactComponent as QuestionIco } from '../../../assets/icons/question.svg';

function Header() {
	return (
		<header>
			<img className={styles.logo} src={logo} alt='logo' />
			<GameButtonIco style={styles.rules} Ico={QuestionIco} onClick={() => {}}>
				Правила
			</GameButtonIco>
		</header>
	);
}

export default Header;
