const Router = require('express').Router;
const router = new Router();
const lobbyController = require('../controllers/lobby-controller');
const menuController = require('../controllers/menu-controller');
const userController = require('../controllers/user-controller');
const tokenValidator = require('../middlewares/tokenValidator');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', tokenValidator, userController.logout);
router.get('/checkToken', tokenValidator, userController.checkToken);

router.get('/menu', tokenValidator, menuController.getUserInfo);

router.post('/lobby', tokenValidator, lobbyController.createLobby);
router.post('/lobby/:id', tokenValidator, lobbyController.enterLobby);
router.get('/lobby/:id', tokenValidator, lobbyController.showUsersInLobby);
router.delete('/lobby/:id', tokenValidator, lobbyController.leaveLobby);
router.put('/lobby/:id', tokenValidator, lobbyController.setReady);

module.exports = router;
