const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Root path handler
app.get('/', (req, res) => {
  console.log('Root path accessed');
  res.json({ message: 'Welcome to the ravExchange API' });
});

// Wrap the Express app with serverless
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  console.log('Function executed!', event.path);
  return await handler(event, context);
};