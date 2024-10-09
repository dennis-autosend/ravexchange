const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

const handler = serverless(app);

exports.handler = async (event, context) => {
  return await handler(event, context);
};

