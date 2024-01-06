import React from 'react';
import styles from './Checkbox.module.css';
import { ReactComponent as Checkmark } from '../../../assets/icons/checkmark.svg';
import { ReactComponent as Crown } from '../../../assets/icons/crown.svg';

function Checkbox({ checked, isHost, ...props }) {
	return (
		<div className={styles.checkbox}>
			<input {...props} type='checkbox' checked={checked} />
			{isHost && <Crown />}
			{!isHost && checked && <Checkmark />}
		</div>
	);
}

export default Checkbox;
