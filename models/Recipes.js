const mongoose = require('mongoose');

const recipesSchema = new mongoose.Schema({
    name : String,
    description : String,
    ingredients : String,
    // Images : 
    instructions : String,
    recipeId : String,
    nutritionalFacts : String,
    creatorId : String
});

const Recipes = mongoose.model('Recipes', recipesSchema);

module.exports = Recipes;