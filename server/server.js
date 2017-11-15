import express from 'express';
import bodyParser from 'body-parser';
const cors = require('cors')

import TablesList from './src/views/Pages/CustomSql/tables.json';

const server = express();
server.use(bodyParser.json());
server.use(cors());

server.get(['/ping'], (req, res) => {
  res.status(200).send('All looks good');
});

server.get(['/table-details'], (req, res) => {
  res.status(200).send(TablesList);
});

server.listen(3000, '0.0.0.0', () => {
  console.info('Express listening on port', 3000);
});
