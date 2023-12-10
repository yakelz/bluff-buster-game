const callProcedure = require('../db/call');

class MenuController {
	async getUserInfo(req, res, next) {
		try {
			const params = [req.session.token];
			const userInfo = await callProcedure('showUserInfo', params);
			let currentGames = await callProcedure('getCurrentGames', params);
			let availableGames = await callProcedure('showAvailableGames', params);

			currentGames = Array.isArray(currentGames)
				? currentGames
				: currentGames
				? [currentGames]
				: [];
			availableGames = Array.isArray(availableGames)
				? availableGames
				: availableGames
				? [availableGames]
				: [];

			console.log(currentGames);
			console.log(availableGames);

			res.status(200).json({
				userInfo: userInfo,
				currentGames: currentGames,
				availableGames: availableGames,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new MenuController();
