const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const router = require('./router/index');
const app = express();
const PORT = process.env.PORT || 3000;

const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;

const redisClient = createClient({
	username: 'default',
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
	retry_strategy: function (options) {
		if (options.error && options.error.code === 'ECONNREFUSED') {
			return new Error('Сервер отказал в подключении');
		}
		// Повторное подключение
		return Math.min(options.attempt * 100, 3000);
	},
});

redisClient.connect().catch(console.error);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(
	session({
		store: new RedisStore({ client: redisClient, prefix: 'bb_game: ' }),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false, // true, если HTTPS
			httpOnly: true, // Куки недоступны из JavaScript
			maxAge: 7 * 24 * 60 * 15 * 1000, // Время жизни куки в миллисекундах (7 дней), после он удаляет сессию из Redis
			sameSite: 'strict', // Куки доступны только для текущего сайта
		},
	})
);

app.use('/api', router);
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
