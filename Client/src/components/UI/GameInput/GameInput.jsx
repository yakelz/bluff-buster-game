import React, { useEffect } from 'react';
import styles from './GameInput.module.css';
import { useController } from 'react-hook-form';
import { ReactComponent as ErrorIco } from '../../../assets/icons/error.svg';
import { toast } from 'react-toastify';
function GameInput({ control, name, rules, ...props }) {
	const { field, fieldState } = useController({
		control,
		name,
		rules,
	});

	useEffect(() => {
		if (fieldState.error) {
			toast.error(fieldState.error.message);
		}
	}, [fieldState.error]);

	return (
		<div className={styles.inputWrapper}>
			<input {...field} {...props} className={`${styles.input} input-label`} />
			{fieldState.error && <ErrorIco title={fieldState.error.message} className={styles.ico} />}
		</div>
	);
}

export default GameInput;
