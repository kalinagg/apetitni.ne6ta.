const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const uuidv4 = require('uuid/v4');
const app = express();
const RecipeManager = require('./RecipeManagerServer.js');
const recipeManager = new RecipeManager();

app.use(bodyParser.json());
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024}
}));

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

app.post('/recipes/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const image = req.files.image;
    const imagePath = 'img-food/' + 'img-' + uuidv4() + '.jpg';

    image.mv(imagePath, err => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send([imagePath]);
    });
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