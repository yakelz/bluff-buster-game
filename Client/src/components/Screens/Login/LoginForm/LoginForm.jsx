import React, { useContext } from 'react';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../utils/authProvider';
import useApi from '../../../../hooks/useApi';

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: 'narutka',
			password: 'superpass123',
		},
	});
	const { setIsAuthenticated } = useContext(AuthContext);
	const { sendRequest, error: apiError } = useApi();

	const onSubmit = async (values) => {
		sendRequest({
			url: '/login',
			method: 'POST',
			payload: values,
			onSuccess: (data) => {
				alert('Вы успешно вошли в систему!');
				setIsAuthenticated(true);
				console.log(data);
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
					{...register('username', { required: 'Введите имя пользователя' })}
				/>
				{errors.username && <p className={styles.error}>{errors.username?.message}</p>}
			</div>
			<div>
				<label htmlFor='password'> Пароль:</label>
				<input
					id='password'
					type='password'
					{...register('password', { required: 'Введите пароль' })}
				/>
			</div>
			{errors.password && <p className={styles.error}>{errors.password?.message}</p>}
			<button type='submit'>Войти</button>
			{errors.server && <p className={styles.error}>{errors.server.message}</p>}
		</form>
	);
};

export default LoginForm;
