export const createHandleSort = (setSortOption, filteredPosts, setFilteredPosts) => {
    return (option) => {
        setSortOption(option);
        const sortedPosts = [...filteredPosts].sort((a, b) => {
            switch (option) {
                case 'dateAsc':
                    return new Date(a.eventDate) - new Date(b.eventDate);
                case 'dateDesc':
                    return new Date(b.eventDate) - new Date(a.eventDate);
                case 'priceAsc':
                    return a.price - b.price;
                case 'priceDesc':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });
        setFilteredPosts(sortedPosts);
    };
};