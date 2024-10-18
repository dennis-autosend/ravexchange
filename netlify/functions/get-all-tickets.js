const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    try {
        const database = await connectToDatabase();
        const tickets = database.collection('tickets');

        const availableTickets = await tickets.find({ status: "available" })
            .sort({ updatedAt: -1, createdAt: -1 })
            .toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(availableTickets)
        };
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch tickets' })
        };
    }
};