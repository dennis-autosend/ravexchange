import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TicketActions from './TicketActions';

const TicketList = ({ posts, handleBuyTicket, handleUpdateTicket, handleDeleteTicket, userPhoneNumber }) => {
    return (
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
    );
};

export default TicketList;