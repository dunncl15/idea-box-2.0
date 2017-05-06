const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (error, file) => {
    response.send(file)
  });
});

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
  .then(folders => response.status(200).json(folders))
  .catch(error => console.error('error: ', error))
});

app.get('/api/v1/ideas', (request, response) => {
  database('ideas').select()
  .then(ideas => response.status(200).json(ideas))
  .catch(error => console.error('error: ', error))
})

app.post('/api/v1/ideas', (request, response) => {
  const idea = request.body;
  database('ideas').insert(idea, 'id')
  .then(idea => response.status(201).json({ id: idea[0] }))
  .catch(error => console.error('error: ', error))
})

app.delete('/api/v1/ideas/:id', (request, response) => {
  const id = request.params.id;
  database('ideas').where('id', id).del()
  .then(() => response.sendStatus(200))
  .catch(error => console.error('error: ', error))
})

app.listen(app.get('port'), () => {
  console.log(`server running on port ${app.get('port')}`);
});
