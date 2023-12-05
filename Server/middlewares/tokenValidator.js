module.exports = (req, res, next) => {
	// Проверяет только наличие токена в куках
	// Не проверят его годность на сервере
	console.log('tokenValidator');
	if (!req.session.token) {
		return res.status(401).json({ message: 'Токен не предоставлен' });
	}
	next();
};
