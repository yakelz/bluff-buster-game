import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const LobbySettingsForm = ({ onSubmit, title, initialData = {} }) => {
	const [isPrivate, setIsPrivate] = useState(initialData.isPrivate || false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
	});

	return (
		<div>
			<h1>{title} игровое лобби</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor='privateRoom'>Создать приватную комнату</label>
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
						<label htmlFor='password'>Password:</label>
						<input
							id='password'
							type='text'
							{...register('password', isPrivate ? { required: 'Password is required' } : {})}
						/>
						{errors.password && <p>{errors.password.message}</p>}
					</div>
				)}
				<div>
					<label htmlFor='turn_time'>Turn Time (sec):</label>
					<select id='turn_time' {...register('turn_time', { required: 'Turn time is required' })}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
					{errors.turn_time && <p>{errors.turn_time.message}</p>}
				</div>
				<div>
					<label htmlFor='check_time'>Check Time (sec):</label>
					<select id='check_time' {...register('check_time')}>
						<option value='10'>10</option>
						<option value='15'>15</option>
						<option value='20'>20</option>
						<option value='25'>25</option>
						<option value='30'>30</option>
					</select>
				</div>
				<button type='submit'>{title}</button>
			</form>
		</div>
	);
};

export default LobbySettingsForm;
