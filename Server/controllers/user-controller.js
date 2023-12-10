const axios = require('axios');
const callProcedure = require('../db/call');

class UserController {
	async register(req, res, next) {
		const { username, password } = req.body;

		try {
			const params = [username, password];
			const result = await callProcedure('register', params);

			// Сохранение токена
			req.session.token = result.token;
			req.session.user_id = result.id;
			res.status(200).json({ id: result.id });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ error: error });
		}
	}

	async login(req, res, next) {
		const { username, password } = req.body;

		try {
			const params = [username, password];
			const result = await callProcedure('login', params);

			// // Сохранение токена
			req.session.token = result.token;
			req.session.user_id = result.id;
			res.status(200).json({ id: result.id });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ error: error });
		}
	}

	async logout(req, res, next) {
		try {
			const result = await callProcedure('logout', [req.session.token]);
			// Если токен удален, удаляем сессию
			req.session.destroy();
			res.status(200).json({ message: 'Выход выполнен' });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ error: error });
		}
	}

	async checkToken(req, res, next) {
		try {
			const procedureName = 'checkToken';
			const params = [req.session.token];
			const result = await callProcedure(procedureName, params);

			if (result.isValid) {
				return res.json({
					isAuth: true,
					id: req.session.user_id,
				});
			} else {
				req.session.destroy();
				return res.json({
					isAuth: false,
				});
			}
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ error: error });
		}
	}
}

module.exports = new UserController();
