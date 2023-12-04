module.exports = (req, res, next) => {
	// Проверяет только наличие токена в куках
	// Не проверят его годность на сервере
	console.log('tokenValidator');
	const token = req.session.token[0];
	if (!token) {
		return res.status(401).json({ message: 'Токен не предоставлен' });
	}
	next();
};
