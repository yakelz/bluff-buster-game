import { createSlice } from '@reduxjs/toolkit';

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: {
		lobbySettings: null,
		players: [],
		lobbyId: null,
	},
	reducers: {
		setLobbySettings: (state, action) => {
			state.lobbySettings = action.payload;
		},
		setPlayers: (state, action) => {
			state.players = action.payload;
		},
		setLobbyId: (state, action) => {
			state.lobbyId = action.payload;
		},
	},
});

export const { setLobbySettings, setPlayers, setLobbyId } = lobbySlice.actions;

export default lobbySlice.reducer;
