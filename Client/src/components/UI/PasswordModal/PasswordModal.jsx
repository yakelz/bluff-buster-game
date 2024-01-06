import { useState } from 'react';
import styles from './PasswordModal.module.css';
import BlurContainer from '../BlurContainer/BlurContainer';
import GameButton from '../Buttons/GameButton';
import GameButtonIco from '../Buttons/GameButtonIco';
import { ReactComponent as CloseIco } from '../../../assets/icons/close.svg';

function PasswordModal({ onClose, onConfirm }) {
	const [password, setPassword] = useState('');

	return (
		<div className={styles.modalOverlay}>
			<BlurContainer style={styles.modal}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Введите пароль</h2>
					<GameButtonIco Ico={CloseIco} style={styles.close} onClick={onClose}>
						Закрыть
					</GameButtonIco>
				</div>
				<div className={styles.modalBody}>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Пароль'
						className={styles.passwordInput}
					/>
				</div>
				<div className={styles.modalFooter}>
					<GameButton onClick={() => onConfirm(password)}>Подтвердить</GameButton>
				</div>
			</BlurContainer>
		</div>
	);
}

export default PasswordModal;
