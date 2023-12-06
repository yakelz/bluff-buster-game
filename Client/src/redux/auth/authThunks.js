import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { setAuth } from './authSlice';

export const checkToken = createAsyncThunk('auth/checkToken', async (token, { dispatch }) => {
	try {
		const response = await axios.get('/checkToken');
		dispatch(
			setAuth({
				isAuth: response.data.isAuth,
			})
		);
	} catch (error) {
		dispatch(
			setAuth({
				isAuth: false,
			})
		);
	}
});
