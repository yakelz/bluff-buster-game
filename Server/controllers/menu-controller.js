const callProcedure = require('../db/call');

class MenuController {
	async getMenu(req, res, next) {
		try {
			const params = [req.session.token];
			const userInfo = await callProcedure('showUserInfo', params);
			let currentGames = await callProcedure('getCurrentGames', params);

			currentGames = Array.isArray(currentGames)
				? currentGames
				: currentGames
				? [currentGames]
				: [];

			console.log(currentGames);

			res.status(200).json({
				userInfo: userInfo,
				currentGames: currentGames,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error });
		}
	}

	async getAvailableGames(req, res, next) {
		try {
			const params = [req.session.token];
			let availableGames = await callProcedure('showAvailableGames', params);

			availableGames = Array.isArray(availableGames)
				? availableGames
				: availableGames
				? [availableGames]
				: [];

			console.log(availableGames);

			res.status(200).json({
				availableGames: availableGames,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new MenuController();
