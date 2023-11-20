const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/token', userController.getToken);

module.exports = router;