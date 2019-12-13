const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(pino);

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

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);  