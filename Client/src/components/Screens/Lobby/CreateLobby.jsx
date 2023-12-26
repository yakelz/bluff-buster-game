import React from 'react';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import LobbySettingsForm from './LobbySettingsForm';

const CreateLobby = () => {
	const { sendRequest } = useApi();
	const navigate = useNavigate();

	const onSubmit = (values) => {
		console.log(values);
		sendRequest({
			url: '/lobby/',
			method: 'POST',
			payload: values,
			onSuccess: (data) => navigate(`/lobby/${data.lobbyID}`),
		});
	};

	return (
		<main>
			<LobbySettingsForm title='Создать' onSubmit={onSubmit} />
		</main>
	);
};

export default CreateLobby;
