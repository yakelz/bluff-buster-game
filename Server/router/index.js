const Router = require('express').Router;
const router = new Router();

const gameController = require('../controllers/game-controller');
const lobbyController = require('../controllers/lobby-controller');
const menuController = require('../controllers/menu-controller');
const userController = require('../controllers/user-controller');
const tokenValidator = require('../middlewares/tokenValidator');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', tokenValidator, userController.logout);
router.get('/checkToken', tokenValidator, userController.checkToken);

router.get('/menu', tokenValidator, menuController.getMenu);
router.get('/search', tokenValidator, menuController.getAvailableGames);

router.post('/lobby', tokenValidator, lobbyController.createLobby);
router.post('/lobby/:id', tokenValidator, lobbyController.enterLobby);
router.get('/lobby/:id', tokenValidator, lobbyController.getLobbyInfo);
router.delete('/lobby/:id', tokenValidator, lobbyController.leaveLobby);
router.put('/lobby/:id', tokenValidator, lobbyController.setReady);
router.patch('/lobby/:id', tokenValidator, lobbyController.changeLobbySettings);

router.post('/game/:id', tokenValidator, gameController.startGame);
router.get('/game/:id', tokenValidator, gameController.updateGameInfo);
router.put('/game/:id', tokenValidator, gameController.makeMove);
router.post('/game/:id/check', tokenValidator, gameController.checkBluff);
router.post('/game/:id/decline', tokenValidator, gameController.declineCheckBluff);

module.exports = router;
