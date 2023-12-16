import React from 'react';
import AppRouter from './utils/router';
import { Provider } from 'react-redux';
import store from './redux/store';
import './assets/css/App.css';

const App = () => {
	return (
		<>
			<Provider store={store}>
				<div className='wrapper'>
					<AppRouter />
				</div>
			</Provider>
		</>
	);
};

export default App;
