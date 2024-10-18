import React, { useEffect, useState } from 'react';
import { createHandleSort } from './components/interface/HandleSort';
import LoginStatus from './components/interface/LoginStatus';
import TicketForm from './components/interface/TicketForm';
import TicketList from './components/interface/TicketList';
import PhoneVerificationPopup, { formatPhoneNumber } from './components/otp/PhoneVerificationPopup';
import { checkLoginStatus } from './components/state/ReloadPageWithLogin';
import { initializeSessionManager } from './components/state/SessionManager';
import { handleBuyTicket as buyTicket } from './components/tickets/buyTickets';
import { deleteTicket } from './components/tickets/deleteTicket';
import { getListings } from './components/tickets/getListings';
import { postTicket } from './components/tickets/postTicket';
import { updateTicket } from './components/tickets/updateTicket';

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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateAsc');

  const handleSort = createHandleSort(setSortOption, filteredPosts, setFilteredPosts);

  useEffect(() => {
    const { isLoggedIn: storedIsLoggedIn, userPhoneNumber: storedUserPhoneNumber } = checkLoginStatus();
    setIsLoggedIn(storedIsLoggedIn);
    setUserPhoneNumber(storedUserPhoneNumber);

    const fetchTickets = async () => {
      const tickets = await getListings();
      setPosts(tickets);
      setFilteredPosts(tickets);
    };
    fetchTickets();

    initializeSessionManager();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = posts.filter(post =>
      post.event.toLowerCase().includes(term) ||
      post.details.toLowerCase().includes(term) ||
      post.price.toString().includes(term) ||
      new Date(post.eventDate).toLocaleDateString().includes(term)
    );
    setFilteredPosts(filtered);
  };

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

  const handleUpdateTicket = async (post, updatedData) => {
    const success = await updateTicket(post, updatedData, userPhoneNumber, setPosts);
    if (success) {
      // 更新が成功した場合、必要に応じて追加の処理を行う
    }
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

          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 mb-4 border rounded"
          />

          <TicketList
            posts={filteredPosts}
            handleBuyTicket={handleBuyTicket}
            handleUpdateTicket={handleUpdateTicket}
            handleDeleteTicket={handleDeleteTicket}
            userPhoneNumber={userPhoneNumber}
            handleSort={handleSort}
            sortOption={sortOption}
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