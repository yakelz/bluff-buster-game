import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import styles from './Lobby.module.css';
import GameButton from '../../UI/Buttons/GameButton';
import GameInput from '../../UI/GameInput/GameInput';

const LobbySettingsForm = ({ onSubmit, title, initialData = {} }) => {
	console.log(initialData);
	const [isPrivate, setIsPrivate] = useState(Boolean(initialData?.hasPassword) || false);
	console.log(isPrivate);
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
		turn_time: initialData?.turn_time,
		check_time: initialData?.check_time,
	});

	return (
		<BlurContainer style={styles.create}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h1>{title} лобби</h1>
				<div>
					<label htmlFor='turn_time'>Время хода (сек):</label>
					<select id='turn_time' {...register('turn_time')}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
					{errors.turn_time && <p>{errors.turn_time.message}</p>}
				</div>
				<div>
					<label htmlFor='check_time'>Время проверки (сек):</label>
					<select id='check_time' {...register('check_time')}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
				</div>
				<div>
					<label htmlFor='privateRoom'>Приватная комната</label>
					<input
						id='privateRoom'
						type='checkbox'
						{...register('isPrivate')}
						checked={isPrivate}
						onChange={() => setIsPrivate(!isPrivate)}
					/>
				</div>
				{isPrivate && (
					<div>
						<label htmlFor='password'>Пароль:</label>
						<GameInput
							control={control}
							name='password'
							type='text'
							rules={isPrivate ? { required: 'Password is required' } : {}}
						/>
						{errors.password && <p>{errors.password.message}</p>}
					</div>
				)}
				<GameButton type='submit'>{title}</GameButton>
			</form>
		</BlurContainer>
	);
};

export default LobbySettingsForm;
