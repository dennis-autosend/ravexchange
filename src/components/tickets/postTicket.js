import { reloadPageWithLogin } from '../state/ReloadPageWithLogin';

export const postTicket = async (newPost, userPhoneNumber, setPosts, setNewPost) => {
    if (newPost.event && newPost.price && newPost.details && newPost.eventDate) {
        try {
            const response = await fetch('/.netlify/functions/create-ticket', {
                method: 'POST',
                body: JSON.stringify({
                    eventName: newPost.event,
                    price: newPost.price,
                    description: newPost.details,
                    eventDate: newPost.eventDate,
                    sellerId: userPhoneNumber
                }),
            });

            const data = await response.json();

            if (data.success) {
                const newTicket = {
                    ...newPost,
                    id: data.ticketId,
                    sold: false,
                    mobileNumber: userPhoneNumber
                };
                setPosts(prevPosts => [newTicket, ...prevPosts]);
                setNewPost({ event: '', price: '', details: '', eventDate: '' });
                alert('Ticket posted successfully!');
                reloadPageWithLogin(userPhoneNumber);
            } else {
                alert(`Failed to post ticket. Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error posting ticket:', error);
            alert('An error occurred while posting the ticket. Please try again.');
        }
    } else {
        alert('Please fill in all required fields (event, price, details, and event date).');
    }
};