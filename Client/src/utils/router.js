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
import CreateLobby from '../components/Screens/CreateLobby/CreateLobby';
import { AuthContext } from './authProvider';

const AppRouter = () => {
	const { isAuthenticated, isLoading } = useContext(AuthContext);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<Router>
			{isAuthenticated ? (
				<>
					<Routes>
						<Route path='/' element={<Menu />} />
						<Route path='/lobby/:id' element={<Lobby />} />
						<Route path='/create/' element={<CreateLobby />} />
						<Route path='/ratings' element={<Ratings />} />
						<Route path='/rules' element={<Rules />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='*' element={<Navigate to='/' />} />
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
