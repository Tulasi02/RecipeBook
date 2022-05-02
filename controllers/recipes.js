const Recipe = require('../models/Recipes');
const {v4 : uuidv4} = require('uuid');

exports.addRecipe = (req, res, next) => {
    // res.status(200).send({message : 'Add recipe'});
    const recipe = new Recipe({
        name : req.body.name,
        description : req.body.description,
        ingredients : req.body.ingredients,
        instructions : req.body.instructions,
        recipeId : uuidv4(),
        nutritionalFacts : req.body.facts,
        creatorId : req.body.userId
    });
    recipe.save().then(() => {
        res.status(200).send({
            message : "Recipe added successfully",
            recipeId : recipe.recipeId
        });
    })
    .catch(err => {
        return next(err);
    })
};

exports.editRecipe = (req, res, next) => {
    Recipe.findOne({recipeId: req.body.recipeId}, (err, data) => {
        if (err) {
            throw err;
        }
        data.description = req.body.description;
        data.ingredients = req.body.ingredients;
        data.instructions = req.body.instructions;
        data.nutritionalFacts = req.body.facts;
        data.save((err) => {
            if (err) {
                throw err;
            }
        });
    })
    res.send({message: 'success'});
};

exports.searchRecipe = (req, res, next) => {
    Recipe.find({$or : [{name : {$regex : '.*' + req.body.search + '.*', $options : 'gi'}} , {ingredients : {$regex : '.*' + req.body.search + '.*', $options : 'gi'}}]}, (err, data) => {
        if (err) {
            throw err;
        }
        else  if (data.length != 0) {
            var recipes = data.map(x => {
                return {name : x.name, recipeId : x.recipeId};
            })
            res.json({message: 'success', 'recipes': recipes});
        }
        else {
            res.json({message : "Not Found"});
        }
    })
};

exports.viewRecipe = (req, res, next) => {
    Recipe.findOne({recipeId: req.body.recipeId}, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.json({recipe: data, userId: req.body.userId});
        }
    })
}