import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

const CreateLobby = () => {
	const [isPrivate, setIsPrivate] = useState(false);
	const { data, sendRequest } = useApi();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (values) => {
		console.log(values);
		createLobby(values);
	};

	const createLobby = (values) => {
		sendRequest({
			url: '/lobby/',
			method: 'POST',
			payload: values,
			onSuccess: (data) => navigate(`/lobby/${data.lobbyID}`),
		});
	};

	return (
		<div>
			<h1>Create Lobby</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor='privateRoom'>Создать приватную комнату</label>
					<input
						id='privateRoom'
						type='checkbox'
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
						{isPrivate && errors.password && <p>{errors.password.message}</p>}
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
				<button type='submit'>Создать комнату</button>
			</form>
		</div>
	);
};

export default CreateLobby;
