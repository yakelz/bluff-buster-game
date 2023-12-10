const callProcedure = require('../db/call');

class LobbyController {
	async enterLobby(req, res, next) {
		const lobbyId = req.params.id;

		console.log(req.params);
		try {
			const params = [req.session.token, lobbyId];
			const result = await callProcedure('enterLobby', params);
			res.status(200).json({ message: 'Вход в лобби выполнен' });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async leaveLobby(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const params = [req.session.token, lobbyId];
			const result = await callProcedure('leaveLobby', params);
			res.status(200).json({ message: 'Выход в лобби выполнен' });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async getLobbyInfo(req, res, next) {
		const lobbyId = req.params.id;
		try {
			let usersInLobby = await callProcedure('getLobbyInfo', [req.session.token, lobbyId]);
			const lobbySettings = await callProcedure('getLobbySettings', [lobbyId]);
			const host = await callProcedure('getHost', [lobbyId]);

			usersInLobby = Array.isArray(usersInLobby)
				? usersInLobby
				: usersInLobby
				? [usersInLobby]
				: [];

			res.status(200).json({
				usersInLobby: usersInLobby,
				lobbySettings: lobbySettings,
				host: host,
			});
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async createLobby(req, res, next) {
		const { password, turn_time, check_time } = req.body;
		try {
			const procedureName = 'createLobby';
			const params = [req.session.token, password ? password : null, turn_time, check_time];
			const response = await callProcedure(procedureName, params);
			res.status(200).json(response);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async setReady(req, res, next) {
		const lobbyId = req.params.id;
		const { state } = req.body;
		try {
			let usersInLobby = await callProcedure('setReady', [req.session.token, lobbyId, state]);
			const lobbySettings = await callProcedure('getLobbySettings', [lobbyId]);
			const host = await callProcedure('getHost', [lobbyId]);

			usersInLobby = Array.isArray(usersInLobby)
				? usersInLobby
				: usersInLobby
				? [usersInLobby]
				: [];

			res.status(200).json({
				usersInLobby: usersInLobby,
				lobbySettings: lobbySettings,
				host: host,
			});
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async changeLobbySettings(req, res, next) {
		const { password, turn_time, check_time } = req.body;
		const lobbyId = req.params.id;
		try {
			const procedureName = 'changeLobbySettings';
			const params = [
				req.session.token,
				lobbyId,
				password ? password : null,
				turn_time,
				check_time,
			];
			const response = await callProcedure(procedureName, params);
			res.status(200).json(response);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new LobbyController();
