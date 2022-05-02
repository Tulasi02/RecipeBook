const recipesRoutes = require('express').Router();
const recipesController = require('../controllers/recipes');
const tokenScript = require('../scripts/jwtAuth');

recipesRoutes.put('/addRecipe', tokenScript.checkToken, recipesController.addRecipe);

recipesRoutes.patch('/editRecipe', tokenScript.checkToken, recipesController.editRecipe);

recipesRoutes.post('/searchRecipe', tokenScript.checkToken, recipesController.searchRecipe);

recipesRoutes.post('/viewRecipe', tokenScript.checkToken, recipesController.viewRecipe);

module.exports = recipesRoutes;