const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const router = require('./router/index')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // true, если HTTPS
			httpOnly: true, // Куки недоступны из JavaScript
			maxAge: 7 * 24 * 60 * 60 * 1000, // Время жизни куки в миллисекундах (7 дней)
			sameSite: 'strict', // Куки доступны только для текущего сайта
		},
	})
);


app.use('/api', router);
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
