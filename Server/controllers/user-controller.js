const axios = require("axios");

class UserController {
    async register (req, res, next) {
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
            console.log(response);
            if (response.status === 200) {
                if (response.data.error) {
                    res.status(500).json({ message: response.data.error });
                    return;
                }
                const data = response.data;
                console.log(data);
                res.json({ token: data.token });
            } else {
                res.status(500).json({ message: 'Ошибка при регистрации' });
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async login (req, res, next) {
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
            if (response.status === 200) {
                const data = response.data;

                if (data.error) {
                    // Ошибка авторизации
                    res.status(500).json({ message: data.error });
                    return;
                }

                // Сохранение токена
                req.session.token = data.token;
                res.status(200).json({ message: "Вход выполнен" });
            }
        } catch (error) {
            // Ошибка при запросе в БД
            res.status(500).json({ message: error.message });
        }
    }

    async logout (req, res, next) {
        try {

        } catch (e) {

        }
    }

    async getToken (req, res, next) {
        const sessionToken = req.session;
        console.log('Токен сессии:', sessionToken);
        console.log('Токен сессии:', sessionToken.token);
        res.json(sessionToken);
        console.log(req.sessionStore.sessions);
    }
}

module.exports = new UserController();