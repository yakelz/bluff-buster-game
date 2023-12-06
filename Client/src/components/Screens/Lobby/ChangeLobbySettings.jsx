import React from 'react';
import useApi from '../../../hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import LobbySettingsForm from './LobbySettingsForm';

const ChangeLobbySettings = () => {
	const { sendRequest } = useApi();
	const navigate = useNavigate();
	const { id: lobbyId } = useParams();

	const onSubmit = (values) => {
		sendRequest({
			url: `/lobby/${lobbyId}`,
			method: 'PATCH',
			payload: values,
			onSuccess: () => navigate(`/lobby/${lobbyId}`),
		});
	};
	console.log(lobbyId);

	return <LobbySettingsForm title='Изменить' onSubmit={onSubmit} />;
};

export default ChangeLobbySettings;
