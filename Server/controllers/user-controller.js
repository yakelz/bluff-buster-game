const axios = require('axios');

class UserController {
	async register(req, res, next) {
		const { username, password } = req.body;

		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'register',
					p1: username,
					p2: password,
				},
			});
			const data = response.data;

			// Ошибка регистрации
			if (data.error) {
				res.status(500).json({ message: response.data.error });
				return;
			}

			// Сохранение токена
			req.session.token = data.token;
			res.status(200).json({ message: 'Вход выполнен' });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}

	async login(req, res, next) {
		const { username, password } = req.body;

		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'login',
					p1: username,
					p2: password,
				},
			});
			const data = response.data;

			if (data.error) {
				// Ошибка авторизации
				res.status(500).json({ message: data.error });
				return;
			}

			// Сохранение токена
			req.session.token = data.token;
			res.status(200).json({ id: data.id });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}

	async logout(req, res, next) {
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'logout',
					p1: req.session.token[0],
				},
			});
			const data = response.data;

			// Если токен не валиден
			if (data.error) {
				res.status(500).json({ message: data.error });
				return;
			}

			// Если токен удален, удаляем сессию
			req.session.destroy();
			res.status(200).json({ message: 'Выход выполнен' });
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}

	async checkToken(req, res, next) {
		try {
			const response = await axios.get(process.env.DB_URL, {
				params: {
					db: process.env.DB_NAME,
					pname: 'checkToken',
					p1: req.session.token[0],
				},
			});
			console.log(response.data);
			if (response.data.isValid) {
				return res.json({
					isAuth: true,
				});
			} else {
				return res.json({
					isAuth: false,
				});
			}
		} catch (error) {
			// Ошибка при запросе в БД
			res.status(500).json({ message: error.message });
		}
	}
}

module.exports = new UserController();
