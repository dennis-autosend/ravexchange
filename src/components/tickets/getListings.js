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
            eventDate: ticket.eventDate,
            sold: ticket.status !== "available",
            updatedAt: ticket.updatedAt || ticket.createdAt
        })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};