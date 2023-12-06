import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoading: true,
		isAuthenticated: false,
		userID: null,
	},
	reducers: {
		setAuth: (state, action) => {
			state.isAuthenticated = action.payload.isAuth;
			state.userID = action.payload.userID;
			state.isLoading = false;
		},
	},
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
