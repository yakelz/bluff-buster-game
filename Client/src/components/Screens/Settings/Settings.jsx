import React from 'react';
import useApi from '../../../hooks/useApi';

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
			<button onClick={logout}>Logout</button>
		</main>
	);
};

export default Settings;
