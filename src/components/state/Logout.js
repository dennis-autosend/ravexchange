export const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhoneNumber');
    window.location.reload();
};