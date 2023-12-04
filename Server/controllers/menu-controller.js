const axios = require('axios');

class MenuController {
	async getUserInfo(req, res, next) {
		try {
			// Параллельное выполнение запросов к БД
			const [userInfo, currentGames, availableGames] = await Promise.all([
				axios.get(process.env.DB_URL, {
					params: { db: process.env.DB_NAME, pname: 'showUserInfo', p1: req.session.token[0] },
				}),
				axios.get(process.env.DB_URL, {
					params: { db: process.env.DB_NAME, pname: 'getCurrentGames', p1: req.session.token[0] },
				}),
				axios.get(process.env.DB_URL, {
					params: {
						db: process.env.DB_NAME,
						pname: 'showAvailableGames',
						p1: req.session.token[0],
					},
				}),
			]);

			res.status(200).json({
				userInfo: userInfo.data,
				currentGames: currentGames.data,
				availableGames: availableGames.data,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
}

module.exports = new MenuController();
