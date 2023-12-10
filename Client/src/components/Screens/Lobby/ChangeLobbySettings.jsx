import React from 'react';
import useApi from '../../../hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import LobbySettingsForm from './LobbySettingsForm';
import { useSelector } from 'react-redux';

const ChangeLobbySettings = () => {
	const { sendRequest } = useApi();
	const navigate = useNavigate();
	const { id: lobbyId } = useParams();
	const lobbySettings = useSelector((state) => state.lobby.lobbySettings);

	console.log(lobbySettings);

	const onSubmit = (values) => {
		console.log(values);
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'PATCH',
			payload: values,
			onSuccess: () => navigate(`/lobby/${lobbyId}`),
		});
	};
	console.log(lobbyId);

	return <LobbySettingsForm title='Изменить' onSubmit={onSubmit} initialData={lobbySettings} />;
};

export default ChangeLobbySettings;
