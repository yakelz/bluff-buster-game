const axios = require('axios');

class LobbyController {
	async enterLobby(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'enterLobby',
					p1: req.session.token[0],
					p2: lobbyId,
				},
			});
			const data = response.data;
			console.log(data);

			// Ошибка из БД
			if (data.error) {
				res.status(500).json({ error: response.data.error });
				return;
			}

			res.status(200).json({ message: 'Вход в лобби выполнен' });
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}

	async leaveLobby(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'leaveLobby',
					p1: req.session.token[0],
					p2: lobbyId,
				},
			});
			const data = response.data;
			console.log(data);

			// Ошибка из БД
			if (data.error) {
				res.status(500).json({ error: response.data.error });
				return;
			}

			res.status(200).json({ message: 'Выход из лобби выполнен' });
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}

	async getLobbyInfo(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const [usersInLobby, lobbySettings, host] = await Promise.all([
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'getLobbyInfo',
						p1: req.session.token[0],
						p2: lobbyId,
					},
				}),
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'getLobbySettings',
						p1: lobbyId,
					},
				}),
				axios.get(process.env.DB_URL, {
					params: { db: process.env.DB_NAME, pname: 'getHost', p1: lobbyId },
				}),
			]);

			// Ошибка из БД
			// ...

			res.status(200).json({
				usersInLobby: usersInLobby.data,
				lobbySettings: lobbySettings.data,
				host: host.data,
			});
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}

	async createLobby(req, res, next) {
		try {
			const { password, turn_time, check_time } = req.body;
			const params = {
				db: process.env.DB_NAME,
				pname: 'createLobby',
				p1: req.session.token[0],
				p2: password ? password : '',
				p3: turn_time,
				p4: check_time,
			};

			const response = await axios.get(process.env.DB_URL, { params });
			const data = response.data;
			console.log(data);

			// Ошибка из БД
			if (data.error) {
				res.status(500).json({ error: response.data.error });
				return;
			}

			res.status(200).json(data);
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}

	async setReady(req, res, next) {
		try {
			const lobbyId = req.params.id;
			const { state } = req.body;

			const [usersInLobby, lobbySettings, host] = await Promise.all([
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'setReady',
						p1: req.session.token[0],
						p2: lobbyId,
						p3: state,
					},
				}),
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'getLobbySettings',
						p1: lobbyId,
					},
				}),
				axios.get(process.env.DB_URL, {
					params: { db: process.env.DB_NAME, pname: 'getHost', p1: lobbyId },
				}),
			]);

			// Ошибка из БД

			res.status(200).json({
				usersInLobby: usersInLobby.data,
				lobbySettings: lobbySettings.data,
				host: host.data,
			});
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}
	async changeLobbySettings(req, res, next) {
		try {
			const { password, turn_time, check_time } = req.body;
			const lobbyId = req.params.id;
			const params = {
				db: process.env.DB_NAME,
				pname: 'changeLobbySettings',
				p1: req.session.token[0],
				p2: lobbyId,
				p3: password ? password : '',
				p4: turn_time,
				p5: check_time,
			};

			const response = await axios.get(process.env.DB_URL, { params });
			const data = response.data;
			console.log(data);

			// Ошибка из БД
			if (data.error) {
				res.status(500).json({ error: response.data.error });
				return;
			}

			res.status(200).json(data);
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new LobbyController();
