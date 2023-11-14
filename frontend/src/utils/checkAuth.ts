const checkAuthToken=() => localStorage.getItem('authToken') ? true : false;
export { checkAuthToken }