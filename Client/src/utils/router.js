import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Screens/Home/Home';
import Login from '../components/Screens/Login/Login';
import Register from '../components/Screens/Register/Register';
import Lobby from '../components/Screens/Lobby/Lobby';
import Ratings from '../components/Screens/Ratings/Ratings';
import Rules from '../components/Screens/Rules/Rules';
import Settings from '../components/Screens/Settings/Settings';

import { useSelector } from 'react-redux';

const AppRouter = () => {
	const isAuth = useSelector((state) => state.auth.isAuth);

	return (
		<Router>
			{isAuth ? (
				<>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/lobby/:id' element={<Lobby />} />
						<Route path='/ratings' element={<Ratings />} />
						<Route path='/rules' element={<Rules />} />
						<Route path='/settings' element={<Settings />} />
					</Routes>
				</>
			) : (
				<>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
					</Routes>
				</>
			)}
		</Router>
	);
};

export default AppRouter;
