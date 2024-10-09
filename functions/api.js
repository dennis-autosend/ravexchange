const express = require('express');
const serverless = require('serverless-http');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('ravexchange'); // replace 'ravexchange' with your database name if different
  cachedDb = db;
  return db;
}

// GET all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const tickets = await db.collection('tickets').find().toArray();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST a new ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PUT (update) a ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: req.body },
      { returnOriginal: false }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// DELETE a ticket
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').findOneAndDelete({ _id: ObjectId(req.params.id) });
    if (result.value) {
      res.json({ message: 'Ticket deleted successfully' });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Handle ticket purchase (you can modify this as needed)
app.post('/api/purchase', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { ticketId } = req.body;
    const result = await db.collection('tickets').findOneAndUpdate(
      { _id: ObjectId(ticketId), sold: false },
      { $set: { sold: true } },
      { returnOriginal: false }
    );
    if (result.value) {
      res.json({ message: 'Ticket purchased successfully', ticket: result.value });
    } else {
      res.status(400).json({ error: 'Ticket not available' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

module.exports.handler = serverless(app);