const axios = require('axios');

class GameController {
	async startGame(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'initGame',
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

			res.status(200).json(data);
		} catch (error) {
			// Ошибка при запросе к БД
			res.status(500).json({ error: error.message });
		}
	}
	async updateGameInfo(req, res, next) {
		const lobbyId = req.params.id;
		try {
			// Параллельное выполнение запросов к БД
			const [gameInfo, playerCards] = await Promise.all([
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'updateGameInfo',
						p1: req.session.token[0],
						p2: lobbyId,
					},
				}),
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'getPlayerCards',
						p1: req.session.token[0],
						p2: lobbyId,
					},
				}),
			]);

			// if (gameInfo.data.error) {
			// 	res.status(500).json(gameInfo.data);
			// }

			res.status(200).json({
				gameInfo: gameInfo.data,
				playerCards: playerCards.data,
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new GameController();
