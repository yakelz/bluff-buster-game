import React from 'react';
import useApi from '../../../hooks/useApi';
import GameButton from '../../UI/Buttons/GameButton';

const Settings = () => {
	const { sendRequest } = useApi();

	const logout = () => {
		sendRequest({
			url: '/logout',
			method: 'POST',
			onSuccess: () => window.location.reload(),
		});
	};

	return (
		<main>
			<h1>Settings</h1>
			<GameButton onClick={logout}>Logout</GameButton>
		</main>
	);
};

export default Settings;
