import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TicketActions from './TicketActions';

const TicketList = ({ posts, handleBuyTicket, handleUpdateTicket, handleDeleteTicket, userPhoneNumber, handleSort, sortOption }) => {
    return (
        <div>
            <select onChange={(e) => handleSort(e.target.value)} value={sortOption} className="w-full p-2 mb-4 border rounded">
                <option value="dateAsc">Event Date (Ascending)</option>
                <option value="dateDesc">Event Date (Descending)</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
            </select>

            <div className="space-y-6">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {post.event}
                                {post.sold && <Badge variant="secondary">Sold</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-bold text-lg">Price: ${post.price}</p>
                            <p className="text-gray-600 mt-2">Date: {new Date(post.eventDate).toLocaleDateString()}</p>
                            <p className="text-gray-600 mt-2">{post.details}</p>
                        </CardContent>
                        <CardFooter>
                            {!post.sold && (
                                <TicketActions
                                    post={post}
                                    handleBuyTicket={handleBuyTicket}
                                    handleUpdateTicket={handleUpdateTicket}
                                    handleDeleteTicket={handleDeleteTicket}
                                    userPhoneNumber={userPhoneNumber}
                                />
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TicketList;