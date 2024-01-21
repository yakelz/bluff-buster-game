import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import BlurContainer from '../../UI/BlurContainer/BlurContainer';
import styles from './Lobby.module.css';
import GameButton from '../../UI/Buttons/GameButton';
import GameInput from '../../UI/GameInput/GameInput';
import Checkbox from '../../UI/Checkbox/Checkbox';

const LobbySettingsForm = ({ onSubmit, title, initialData = {} }) => {
	const [isPrivate, setIsPrivate] = useState(Boolean(initialData?.hasPassword) || false);
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...initialData,
			isPrivate: initialData.isPrivate || false,
			password: initialData.password || '',
		},
		turn_time: initialData?.turn_time,
		check_time: initialData?.check_time,
	});

	return (
		<BlurContainer style={styles.create}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h1>{title} лобби</h1>
				<div>
					<label htmlFor='turn_time'>Время хода (сек)</label>
					<select className={styles.select} id='turn_time' {...register('turn_time')}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
					{errors.turn_time && <p>{errors.turn_time.message}</p>}
				</div>
				<div>
					<label htmlFor='check_time'>Время проверки (сек)</label>
					<select className={styles.select} id='check_time' {...register('check_time')}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
				</div>
				<div className={styles.private}>
					<label htmlFor='isPrivate'>Приватная комната</label>
					<Controller
						control={control}
						name='isPrivate'
						render={({ field }) => (
							<Checkbox
								id='isPrivate'
								checked={isPrivate}
								onChange={(e) => {
									setIsPrivate(!isPrivate);
									setValue('isPrivate', e.target.checked);
								}}
							/>
						)}
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
