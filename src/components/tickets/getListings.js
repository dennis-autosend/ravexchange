import { formatPhoneNumber } from '../otp/PhoneVerificationPopup';

export const getListings = async () => {
    try {
        const response = await fetch('/.netlify/functions/get-all-tickets');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(ticket => ({
            id: ticket._id,
            event: ticket.eventName,
            price: ticket.price,
            mobileNumber: formatPhoneNumber(ticket.sellerId),
            details: ticket.description,
            sold: ticket.status !== "available"
        }));
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};