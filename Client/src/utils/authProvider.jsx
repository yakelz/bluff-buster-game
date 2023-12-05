import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const checkToken = async () => {
		try {
			const response = await axios.get('/checkToken');
			setIsAuthenticated(response.data.isAuth);
		} catch (e) {
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkToken();
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, isLoading, setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };
