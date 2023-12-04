const Router = require('express').Router;
const router = new Router();
const menuController = require('../controllers/menu-controller');
const userController = require('../controllers/user-controller');
const tokenValidator = require('../middlewares/tokenValidator');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/checkToken', userController.checkToken);

router.get('/menu', tokenValidator, menuController.getUserInfo);

module.exports = router;
