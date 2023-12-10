import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import lobbyReducer from './lobby/lobbySlice';

export default configureStore({
	reducer: {
		auth: authReducer,
		lobby: lobbyReducer,
	},
});
