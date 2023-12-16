import React from 'react';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import useApi from '../../../../hooks/useApi';

import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../redux/auth/authSlice';
import GameButton from '../../../UI/Buttons/GameButton';
import GameInput from '../../../UI/GameInput/GameInput';

const LoginForm = () => {
	const { handleSubmit, control } = useForm({
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
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<GameInput
				control={control}
				name='username'
				rules={{ required: 'Введите имя пользователя' }}
				placeholder='Имя пользователя'
			/>
			<GameInput
				control={control}
				name='password'
				rules={{ required: 'Введите пароль' }}
				placeholder='Пароль'
				type='password'
			/>
			<GameButton type='submit'>Войти</GameButton>
		</form>
	);
};

export default LoginForm;
