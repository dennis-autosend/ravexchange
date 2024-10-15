const twilio = require('twilio');

exports.handler = async function (event, context) {
    const { to, message } = JSON.parse(event.body);
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, messageSid: response.sid })
        };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};