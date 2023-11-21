import React, { useContext } from 'react';
import styles from './RegistrationForm.module.css';
import axios from '../../../../utils/axios';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../utils/authProvider';

const RegistrationForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { setIsAuthenticated } = useContext(AuthContext);

	const handleRegistration = async (values) => {
		if (values.password !== values.confirmPassword) {
			setError('confirmPassword', {
				type: 'manual',
				message: 'Пароли не совпадают.',
			});
			return;
		}

		try {
			const response = await axios.post('/register', values);
			alert('Регистрация прошла успешно!');
			setIsAuthenticated(true);
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
		<div>
			<form onSubmit={handleSubmit(handleRegistration)}>
				<div>
					<label htmlFor='username'>Имя пользователя:</label>
					<input
						id='username'
						type='text'
						{...register('username', { required: 'Введите имя пользователя' })}
					/>
					{errors.username && <p className={styles.error}>{errors.username.message}</p>}
				</div>
				<div>
					<label htmlFor='password'>Пароль:</label>
					<input
						id='password'
						type='password'
						{...register('password', { required: 'Введите пароль' })}
					/>
					{errors.password && <p className={styles.error}>{errors.password.message}</p>}
				</div>
				<div>
					<label htmlFor='confirmPassword'>Подтвердите пароль:</label>
					<input
						id='confirmPassword'
						type='password'
						{...register('confirmPassword', { required: 'Подтвердите пароль' })}
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
