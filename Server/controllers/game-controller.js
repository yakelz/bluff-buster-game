const callProcedure = require('../db/call');

class GameController {
	async startGame(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const params = [req.session.token, lobbyId];
			const result = await callProcedure('initGame', params);
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
	async updateGameInfo(req, res, next) {
		const lobbyId = req.params.id;
		try {
			const params = [req.session.token, lobbyId];
			const gameInfo = await callProcedure('updateGameInfo', params);
			let handCards = await callProcedure('getPlayerCards', params);
			const players = await callProcedure('getPlayersInLobby', params);
			let turnCards = await callProcedure('getTurnCards', params);

			handCards = Array.isArray(handCards) ? handCards : handCards ? [handCards] : null;

			turnCards = Array.isArray(turnCards) ? turnCards : turnCards ? [turnCards] : null;

			res.status(200).json({
				gameInfo: gameInfo,
				handCards: handCards,
				players: players,
				turnCards: turnCards,
			});
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async makeMove(req, res, next) {
		const { playerID, selectedCards } = req.body;
		const lobbyId = req.params.id;
		while (selectedCards.length < 4) {
			selectedCards.push(null);
		}
		try {
			const params = [req.session.token, playerID, ...selectedCards];
			console.log(params);
			const result = await callProcedure('makeMove', params);

			res.status(200).json({ message: 'Ход выполнен' });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async checkBluff(req, res, next) {
		const { checkerID, turnPlayerID } = req.body;
		try {
			const params = [req.session.token, checkerID, turnPlayerID];
			console.log(params);
			const result = await callProcedure('checkBluff', params);
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}

	async declineCheckBluff(req, res, next) {
		const { checkerID, turnPlayerID } = req.body;
		try {
			const params = [req.session.token, checkerID, turnPlayerID];
			console.log(params);
			const result = await callProcedure('declineCheckBluff', params);

			res.status(200).json({ message: 'Проверка отклонена' });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new GameController();
