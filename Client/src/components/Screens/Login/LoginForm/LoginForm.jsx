import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import axios from '../../../../utils/axios';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../redux/slices/authSlice';
import { Navigate } from 'react-router-dom';

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		clearErrors,
	} = useForm({
		defaultValues: {
			username: 'naruto',
			password: 'superpass123',
		},
	});

	const dispatch = useDispatch();

	const onSubmit = async (values) => {
		try {
			const response = await axios.post('/login', values, {
				withCredentials: true,
			});
			alert('Вы успешно вошли в систему!');
			console.log(response.data);
			dispatch(setAuth(true));
			Navigate('/');
		} catch (error) {
			if (error.response) {
				// Запрос был сделан и сервер ответил статусом ошибки
				setError('server', {
					type: 'manual',
					message: error.response.data.message || 'Ошибка на сервере',
				});
			} else if (error.request) {
				// Запрос был сделан, но ответа не последовало
				console.log(error.request);
				setError('server', { type: 'manual', message: 'Нет ответа от сервера' });
			} else {
				// Произошла ошибка в самом запросе
				console.log('Error', error.message);
				setError('server', { type: 'manual', message: error.message || 'Неизвестная ошибка' });
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor='username'>Имя пользователя:</label>
				<input
					id='username'
					type='text'
					{...register('username', { required: 'Введите имя пользователя' })}
					onChange={() => clearErrors('username')}
				/>
				{errors.username && <p className={styles.error}>{errors.username?.message}</p>}
			</div>
			<div>
				<label htmlFor='password'> Пароль:</label>
				<input
					id='password'
					type='password'
					{...register('password', { required: 'Введите пароль' })}
					onChange={() => clearErrors('password')}
				/>
			</div>
			{errors.password && <p className={styles.error}>{errors.password?.message}</p>}
			<button type='submit'>Войти</button>
			{errors.server && <p className={styles.error}>{errors.server.message}</p>}
		</form>
	);
};

export default LoginForm;
