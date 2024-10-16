const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    try {
        const database = await connectToDatabase();
        const tickets = database.collection('tickets');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await tickets.deleteMany({
            eventDate: { $lt: today.toISOString().split('T')[0] }
        });

        console.log(`${result.deletedCount} expired tickets removed.`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `${result.deletedCount} expired tickets removed.` })
        };
    } catch (error) {
        console.error('Error cleaning up expired tickets:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to clean up expired tickets' })
        };
    }
};