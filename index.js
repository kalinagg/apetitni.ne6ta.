const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const RecipeManager = require('./RecipeManagerServer.js');
const recipeManager = new RecipeManager();

app.use(bodyParser.json());

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await recipeManager.getRecipes();
        res.setHeader('Content-Type', 'application/json');    
        res.status(200).send(recipes);
    } catch(err) {
        res.status(500).send();
        throw err;
    }
});

app.post('/recipes/add', async (req, res) => {
    try {
        const recipe = req.body;

        if (Array.isArray(recipe) || typeof recipe === 'string') {
            throw new Error('Expected one recipe object.');
        }
    
        const recipeId = await recipeManager.addRecipe(recipe);
        res.status(200).send({id: recipeId});
    } catch(err) {
        res.status(500).send();
        throw err;
    }
});

app.post('/recipes/update', async (req, res) => {
    try {
        const recipe = req.body;

        if (Array.isArray(recipe) || typeof recipe === 'string') {
            throw new Error('Expected one recipe object.');
        }

        const recipeId = await recipeManager.updateRecipe(recipe);
        res.status(200).send();
    } catch(err) {
        res.status(500).send();
        throw err;
    }
});

app.post('/recipes/delete', async (req, res) => {
    try {
        const recipeId = req.body.id;

        if (typeof recipeId !== 'string') {
            throw new Error('Expected recipeId to be a string.');
        }

        await recipeManager.deleteRecipe(recipeId);
        res.status(200).send();        
    } catch(err) {
        res.status(500).send();
        throw err;
    }
});

// Serve the image files from root
app.get('/img-food/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port);
console.log('App is listening on port ' + port);