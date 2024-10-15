import React, { useEffect, useState } from 'react';
import LoginStatus from './components/interface/LoginStatus';
import TicketForm from './components/interface/TicketForm';
import TicketList from './components/interface/TicketList';
import PhoneVerificationPopup, { formatPhoneNumber } from './components/otp/PhoneVerificationPopup';
import { handleBuyTicket as buyTicket } from './components/tickets/buyTickets';
import { deleteTicket } from './components/tickets/deleteTicket';
import { getListings } from './components/tickets/getListings';
import { postTicket } from './components/tickets/postTicket';

// Utility functions for formatting
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

const TicketExchangeApp = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ event: '', price: '', mobileNumber: '', details: '' });
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getListings();
      setPosts(tickets);
    };
    fetchTickets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'event') {
      formattedValue = capitalizeWords(value);
    } else if (name === 'mobileNumber') {
      formattedValue = formatPhoneNumber(value);
    }
    setNewPost(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePostTicket = () => {
    if (!isLoggedIn) {
      setIsVerificationOpen(true);
      return;
    }
    postTicket(newPost, userPhoneNumber, setPosts, setNewPost);
  };

  const handleVerificationComplete = (phoneNumber) => {
    setIsLoggedIn(true);
    setUserPhoneNumber(phoneNumber);
  };

  const handleBuyTicket = (post) => {
    buyTicket(post, isLoggedIn, setIsVerificationOpen, userPhoneNumber);
  };

  const handleUpdateTicket = (post) => {
    // Update ticket logic here
    console.log('Update ticket:', post);
  };

  const handleDeleteTicket = (post) => {
    deleteTicket(post, userPhoneNumber, setPosts);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ravExchange</h1>

          <LoginStatus
            isLoggedIn={isLoggedIn}
            userPhoneNumber={userPhoneNumber}
            onLoginClick={() => setIsVerificationOpen(true)}
          />

          <TicketForm
            newPost={newPost}
            handleInputChange={handleInputChange}
            handlePostTicket={handlePostTicket}
          />

          <TicketList
            posts={posts}
            handleBuyTicket={handleBuyTicket}
            handleUpdateTicket={handleUpdateTicket}
            handleDeleteTicket={handleDeleteTicket}
            userPhoneNumber={userPhoneNumber}
          />
        </div>
      </div>

      <PhoneVerificationPopup
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerify={handleVerificationComplete}
      />
    </div>
  );
};

export default TicketExchangeApp;