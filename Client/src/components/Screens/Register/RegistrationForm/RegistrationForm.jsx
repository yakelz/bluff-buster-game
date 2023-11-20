import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';

const RegistrationForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const handleRegistration = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError('Пароли не совпадают.');
			return;
		}

		try {
			const response = await fetch('http://localhost:3001/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			console.log(data);
			if (data.token) {
				alert('Регистрация прошла успешно!');
				setError('');
			} else {
				setError(data.message || 'Не удалось зарегистрироваться.');
			}
		} catch (error) {
			setError('Ошибка при регистрации: ' + (error.message || 'Неизвестная ошибка'));
		}
	};

	return (
		<div>
			<form onSubmit={handleRegistration}>
				<div>
					<label htmlFor='username'>Имя пользователя:</label>
					<input
						id='username'
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='password'>Пароль:</label>
					<input
						id='password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='confirmPassword'>Подтвердите пароль:</label>
					<input
						id='confirmPassword'
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				{error && <p className={styles.error}>{error}</p>}
				<button type='submit'>Зарегистрироваться</button>
			</form>
		</div>
	);
};

export default RegistrationForm;
