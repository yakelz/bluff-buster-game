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
		<div>
			<h1>Settings</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default Settings;
