import React from 'react';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import useApi from '../../../../hooks/useApi';

import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../redux/auth/authSlice';

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: 'narutka',
			password: 'superpass123',
		},
	});

	const { sendRequest } = useApi();
	const dispatch = useDispatch();

	const onSubmit = async (values) => {
		sendRequest({
			url: '/login',
			method: 'POST',
			payload: values,
			onSuccess: (data) => {
				alert('Вы успешно вошли в систему!');
				dispatch(setAuth({ isAuth: true, userID: data.id }));
			},
			onError: (errorMessage) => {
				setError('server', { type: 'manual', message: errorMessage || 'Ошибка на сервере' });
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor='username'>Имя пользователя:</label>
				<input
					id='username'
					type='text'
					{...register('username', {
						required: 'Введите имя пользователя',
						onChange: () => clearErrors('server'),
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
						onChange: () => clearErrors('server'),
					})}
				/>
				{errors.password && <p className={styles.error}>{errors.password.message}</p>}
			</div>
			<button type='submit'>Войти</button>
			{errors.server && <p className={styles.error}>{errors.server.message}</p>}
		</form>
	);
};

export default LoginForm;
