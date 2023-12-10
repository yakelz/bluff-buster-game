const callProcedure = require('../db/call');

class GameController {
	async startGame(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const procedureName = 'initGame';
			const params = [req.session.token, lobbyId]; // Пример параметров
			const result = await callProcedure(procedureName, params);
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
	async updateGameInfo(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const procedureName = 'updateGameInfo';
			const params = [req.session.token, lobbyId]; // Пример параметров
			const result = await callProcedure(procedureName, params);
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new GameController();
