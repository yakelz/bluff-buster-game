import React, { useContext } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from '../components/Screens/Menu/Menu';
import Login from '../components/Screens/Login/Login';
import Register from '../components/Screens/Register/Register';
import Lobby from '../components/Screens/Lobby/Lobby';
import Ratings from '../components/Screens/Ratings/Ratings';
import Rules from '../components/Screens/Rules/Rules';
import Start from '../components/Screens/Start/Start';
import Settings from '../components/Screens/Settings/Settings';

import { AuthContext } from './authProvider';

const AppRouter = () => {
	const { isAuthenticated, isLoading } = useContext(AuthContext);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	console.log(isAuthenticated);
	return (
		<Router>
			{isAuthenticated ? (
				<>
					<Routes>
						<Route path='/menu' element={<Menu />} />
						<Route path='/lobby/:id' element={<Lobby />} />
						<Route path='/ratings' element={<Ratings />} />
						<Route path='/rules' element={<Rules />} />
						<Route path='/settings' element={<Settings />} />\
						<Route path='*' element={<Navigate to='/menu' />} />
					</Routes>
				</>
			) : (
				<>
					<Routes>
						<Route path='/' element={<Start />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='*' element={<Navigate to='/' />} />
					</Routes>
				</>
			)}
		</Router>
	);
};

export default AppRouter;
