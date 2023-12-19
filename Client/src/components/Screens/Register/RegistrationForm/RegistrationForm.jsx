import React from 'react';
import styles from './RegistrationForm.module.css';
import { useForm } from 'react-hook-form';
import useApi from '../../../../hooks/useApi';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../../redux/auth/authSlice';
import GameInput from '../../../UI/GameInput/GameInput';
import GameButton from '../../../UI/Buttons/GameButton';

const RegistrationForm = () => {
	const { handleSubmit, control, setError } = useForm({
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { sendRequest } = useApi();
	const dispatch = useDispatch();

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
				dispatch(setAuth({ isAuth: true, userID: data.id[0] }));
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(handleRegistration)}>
			<div className={styles.container}>
				<h1>Регистрация</h1>
				<div className={styles.inputs}>
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
					<GameInput
						control={control}
						name='confirmPassword'
						rules={{ required: 'Подтвердите пароль' }}
						placeholder='Подтвердите пароль'
						type='password'
					/>
				</div>
				<GameButton type='submit'> Зарегистрироваться</GameButton>
			</div>
		</form>
	);
};

export default RegistrationForm;
