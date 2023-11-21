import React from 'react';
import AppRouter from './utils/router';
import { AuthProvider } from './utils/authProvider';

const App = () => {
	return (
		<div className='App'>
			<AuthProvider>
				<AppRouter />
			</AuthProvider>
		</div>
	);
};

export default App;
