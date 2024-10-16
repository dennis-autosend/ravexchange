export const reloadPageWithLogin = (userPhoneNumber) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhoneNumber', userPhoneNumber);
    window.location.reload();
};

export const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userPhoneNumber = localStorage.getItem('userPhoneNumber');
    return { isLoggedIn, userPhoneNumber };
};