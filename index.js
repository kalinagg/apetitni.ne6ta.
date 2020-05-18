const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const uuidv4 = require('uuid/v4');
const app = express();

app.use(bodyParser.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.get('/recipes', (req, res) => {
    const recipes = fs.readFileSync('./recipes.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(recipes);
});

app.post('/recipes', (req, res) => {
    const data = JSON.stringify(req.body);
    fs.writeFileSync('./recipes.json', data, 'utf8');
    res.status(200).send();
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const image = req.files.image;
    const ext = path.extname(image.name);
    const imagePath = 'img-food/' + 'img-' + uuidv4() + ext;

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