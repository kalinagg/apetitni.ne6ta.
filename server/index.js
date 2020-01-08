const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const uuidv4 = require('uuid/v4');

const app = express();
app.use(bodyParser.json());
app.use(pino);
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.get('/recipes', (req, res) => {
  const recipes = fs.readFileSync('server/recipes.json', 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(recipes);
});

app.post('/recipes', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('server/recipes.json', data, 'utf8');
  res.status(200).send();
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const image = req.files.image;
  const ext = path.extname(image.name);
  const imagePath = 'img-food/' + 'img-' + uuidv4() + ext;

  image.mv('public/' + imagePath, err => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send([imagePath]);
  });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);  