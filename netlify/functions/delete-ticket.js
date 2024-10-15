const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    try {
        const database = await connectToDatabase();
        const tickets = database.collection('tickets');

        const { id, userPhoneNumber } = JSON.parse(event.body);
        console.log('Received request to delete ticket:', { id, userPhoneNumber });

        const ticket = await tickets.findOne({ _id: new ObjectId(id) });
        console.log('Found ticket:', ticket);

        const result = await tickets.deleteOne({
            _id: new ObjectId(id),
            sellerId: userPhoneNumber
        });
        console.log('Delete operation result:', result);

        if (result.deletedCount === 1) {
            console.log('Ticket deleted successfully');
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Ticket deleted successfully' })
            };
        } else {
            console.log('Failed to delete ticket: Unauthorized or not found');
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: 'Unauthorized to delete this ticket or ticket not found' })
            };
        }
    } catch (error) {
        console.error('Error deleting ticket:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Error deleting ticket', error: error.toString() })
        };
    }
};