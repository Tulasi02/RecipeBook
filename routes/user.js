const userRoutes = require('express').Router();
const userController = require('../controllers/user');
const tokenScript = require('../scripts/jwtAuth');

userRoutes.get('/profile', tokenScript.checkToken, userController.profile);

userRoutes.put('/signup', userController.signup);

userRoutes.patch('/update', tokenScript.checkToken, userController.update);

userRoutes.post('/login', userController.login);

module.exports = userRoutes;