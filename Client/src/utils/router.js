import React, { useEffect } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from '../components/Screens/Menu/Menu';
import Login from '../components/Screens/Login/Login';
import Register from '../components/Screens/Register/Register';
import Lobby from '../components/Screens/Lobby/Lobby';
import Ratings from '../components/Screens/Ratings/Ratings';
import Rules from '../components/Screens/Rules/Rules';
import Start from '../components/Screens/Start/Start';
import Settings from '../components/Screens/Settings/Settings';
import CreateLobby from '../components/Screens/Lobby/CreateLobby';
import ChangeLobbySettings from '../components/Screens/Lobby/ChangeLobbySettings';
import Game from '../components/Screens/Game/Game';

import { useSelector, useDispatch } from 'react-redux';
import { checkToken } from '../redux/auth/authThunks';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRouter = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(checkToken());
	}, [dispatch]);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<>
			<Router>
				{isAuthenticated ? (
					<>
						<Routes>
							<Route path='/' element={<Menu />} />
							<Route path='/lobby/:id' element={<Lobby />} />
							<Route path='/lobby/:id/settings' element={<ChangeLobbySettings />} />
							<Route path='/game/:id' element={<Game />} />
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
			<ToastContainer
				position='top-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>
		</>
	);
};

export default AppRouter;
