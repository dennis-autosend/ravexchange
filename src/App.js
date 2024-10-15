import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, Smartphone, Search, Edit, Trash2 } from 'lucide-react';

// Utility functions
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

const formatPhoneNumber = (str) => {
  const cleaned = ('' + str).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return str;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate fake listings
const generateFakeListings = () => {
  const events = [
    { name: 'Electric Daisy Carnival', description: 'Epic 3-day festival under the electric sky!' },
    { name: 'Tomorrowland', description: 'Journey through the magical world of Tomorrowland' },
    { name: 'Ultra Music Festival', description: 'Non-stop beats in the heart of Miami' },
    { name: 'Burning Man', description: 'Transformative journey in Black Rock City' },
    { name: 'Creamfields', description: 'UK\'s biggest dance music festival' },
    { name: 'Defqon.1', description: 'Hardstyle heaven in the Netherlands' },
    { name: 'Sensation White', description: 'All-white dress code for an unforgettable night' },
    { name: 'Amsterdam Dance Event', description: 'World\'s largest club festival and conference for electronic music' }
  ];
  return events.map((event, index) => ({
    id: index + 1,
    event: event.name,
    price: Math.floor(Math.random() * 300) + 100,
    mobileNumber: formatPhoneNumber(Math.floor(Math.random() * 9000000000) + 1000000000),
    details: event.description,
    sold: false,
    eventDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  }));
};

const PhoneVerificationPopup = ({ isOpen, onClose, onVerify }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    console.log('Sending OTP to', phoneNumber);
    alert(`OTP sent to ${phoneNumber}. (In a real app, this would be sent via Twilio)`);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    console.log('Verifying OTP', otp);
    alert('OTP verified successfully!');
    onVerify(phoneNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            Enter your phone number to receive a one-time password (OTP).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!otpSent ? (
            <>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder="Phone Number"
                type="tel"
              />
              <Button onClick={handleSendOtp} className="w-full">Send OTP</Button>
            </>
          ) : (
            <>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                type="text"
              />
              <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TicketExchangeApp = () => {
  const [posts, setPosts] = useState(generateFakeListings());
  const [newPost, setNewPost] = useState({ event: '', price: '', details: '', eventDate: '' });
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      setPosts(prevPosts => prevPosts.filter(post => new Date(post.eventDate) >= currentDate));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
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

    if (newPost.event && newPost.price && newPost.details && newPost.eventDate) {
      const newTicket = {
        ...newPost,
        id: Date.now(),
        sold: false,
        mobileNumber: userPhoneNumber,
        createdAt: new Date().toISOString()
      };
      setPosts(prevPosts => [newTicket, ...prevPosts]);
      setNewPost({ event: '', price: '', details: '', eventDate: '' });
    } else {
      console.log('Please fill in all required fields (event, price, details, and event date).');
    }
  };

  const handleVerificationComplete = (phoneNumber) => {
    setIsLoggedIn(true);
    setUserPhoneNumber(phoneNumber);
  };

  const handleBuyTicket = (post) => {
    if (!isLoggedIn) {
      setIsVerificationOpen(true);
      return;
    }
    console.log('Simulating SMS to seller:', post.mobileNumber);
    alert(`SMS sent to seller at ${post.mobileNumber}. You can now communicate to complete the purchase.`);
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      event: post.event,
      price: post.price,
      details: post.details,
      eventDate: post.eventDate
    });
  };

  const handleUpdatePost = () => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === editingPost.id ? { ...post, ...newPost } : post
    ));
    setEditingPost(null);
    setNewPost({ event: '', price: '', details: '', eventDate: '' });
  };

  const filteredPosts = posts
    .filter(post => post.event.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ravExchange</h1>
          
          {isLoggedIn ? (
            <p className="text-green-600 mb-4 flex items-center justify-center">
              <CheckCircle2 className="mr-2" /> Logged in with {userPhoneNumber}
            </p>
          ) : (
            <Button onClick={() => setIsVerificationOpen(true)} className="w-full mb-4">
              Login with Phone Number
            </Button>
          )}
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingPost ? 'Edit Ticket' : 'Post a Ticket'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  name="event"
                  value={newPost.event}
                  onChange={handleInputChange}
                  placeholder="Event Name"
                  required
                />
                <Input
                  name="price"
                  value={newPost.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  type="number"
                  required
                />
                <Input
                  name="eventDate"
                  value={newPost.eventDate}
                  onChange={handleInputChange}
                  placeholder="Event Date"
                  type="date"
                  required
                />
                <Textarea
                  name="details"
                  value={newPost.details}
                  onChange={handleInputChange}
                  placeholder="Additional details..."
                  required
                />
                <Button onClick={editingPost ? handleUpdatePost : handlePostTicket} className="w-full">
                  {editingPost ? 'Update Ticket' : 'Post Ticket'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full"
              icon={<Search className="h-4 w-4 text-gray-500" />}
            />
          </div>

          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {post.event}
                    {post.sold && <Badge variant="secondary">Sold</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">Price: ${post.price}</p>
                  <p className="text-gray-600 mt-2">{post.details}</p>
                  <p className="text-gray-500 mt-2">Event Date: {formatDate(post.eventDate)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!post.sold && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>Buy Ticket</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to buy this ticket? An SMS will be sent to the seller to initiate the transaction.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBuyTicket(post)}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {isLoggedIn && post.mobileNumber === userPhoneNumber && (
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEditPost(post)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button onClick={() => handleDeletePost(post.id)} variant="outline" className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
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
