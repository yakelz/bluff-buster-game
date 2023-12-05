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

			// Ошибка в БД
			if (data.error) {
				res.status(500).json({ message: response.data.error });
				return;
			}

			res.status(200).json({ message: 'Вход в лобби выполнен' });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
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

			// Ошибка в БД
			if (data.error) {
				res.status(500).json({ message: response.data.error });
				return;
			}

			res.status(200).json({ message: 'Выход из лобби выполнен' });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}

	async showUsersInLobby(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'showUsersInLobby',
					p1: req.session.token[0],
					p2: lobbyId,
				},
			});
			const data = response.data;
			console.log(data);

			// Ошибка в БД
			if (data.error) {
				res.status(500).json({ message: response.data.error });
				return;
			}

			res.status(200).json(data);
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
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

			// Ошибка в БД
			if (data.error) {
				res.status(500).json({ message: response.data.error });
				return;
			}

			res.status(200).json(data);
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}
}

module.exports = new LobbyController();
