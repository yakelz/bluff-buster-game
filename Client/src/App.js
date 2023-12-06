import React from 'react';
import AppRouter from './utils/router';
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
	return (
		<div className='App'>
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</div>
	);
};

export default App;
