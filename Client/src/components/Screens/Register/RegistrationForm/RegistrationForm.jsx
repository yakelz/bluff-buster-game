import React, { useContext } from 'react';
import styles from './RegistrationForm.module.css';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../utils/authProvider';
import useApi from '../../../../hooks/useApi';

const RegistrationForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { setIsAuthenticated } = useContext(AuthContext);
	const { sendRequest } = useApi();

	const handleRegistration = (values) => {
		if (values.password !== values.confirmPassword) {
			setError('confirmPassword', {
				type: 'manual',
				message: 'Пароли не совпадают.',
			});
			return;
		}

		sendRequest({
			url: '/register',
			method: 'POST',
			payload: values,
			onSuccess: (data) => {
				alert('Регистрация прошла успешно!');
				setIsAuthenticated(true);
			},
			onError: (errorMessage) => {
				setError('server', { type: 'manual', message: errorMessage || 'Ошибка на сервере' });
			},
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit(handleRegistration)}>
				<div>
					<label htmlFor='username'>Имя пользователя:</label>
					<input
						id='username'
						type='text'
						{...register('username', {
							required: 'Введите имя пользователя',
							onChange: () => clearErrors(['username', 'server']),
						})}
					/>
					{errors.username && <p className={styles.error}>{errors.username.message}</p>}
				</div>
				<div>
					<label htmlFor='password'>Пароль:</label>
					<input
						id='password'
						type='password'
						{...register('password', {
							required: 'Введите пароль',
							onChange: () => clearErrors(['password', 'server']),
						})}
					/>
					{errors.password && <p className={styles.error}>{errors.password.message}</p>}
				</div>
				<div>
					<label htmlFor='confirmPassword'>Подтвердите пароль:</label>
					<input
						id='confirmPassword'
						type='password'
						{...register('confirmPassword', {
							required: 'Подтвердите пароль',
							onChange: () => clearErrors(['confirmPassword', 'server']),
						})}
					/>
					{errors.confirmPassword && (
						<p className={styles.error}>{errors.confirmPassword.message}</p>
					)}
				</div>
				{errors.server && <p className={styles.error}>{errors.server.message}</p>}
				<button type='submit'>Зарегистрироваться</button>
			</form>
		</div>
	);
};

export default RegistrationForm;
