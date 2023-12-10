import { createSlice } from '@reduxjs/toolkit';

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: {
		lobbySettings: null,
		players: [],
		lobbyId: null,
		// Другие связанные данные лобби
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
		// Другие редьюсеры, если необходимы
	},
});

// Экспортируем редьюсеры для использования в компонентах
export const { setLobbySettings, setPlayers, setLobbyId } = lobbySlice.actions;

export default lobbySlice.reducer;
