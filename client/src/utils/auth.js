import decode from 'jwt-decode';

class AuthService{
    // retrieved data saved inside token
    getProfile() {
        return decode(this.getToken());
    }

    // check if user is still logged in
    loggedIn() {
        // check if the saved token exists/is valid
        const token = this.getToken();
        // use type coersion to check if token is NOT undefined and the token is NOT expired
        return !!token && !this.isTokenExpired(token);
    }

    // check if the token has expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    // retrieve token from localStorage
    getToken() {
        return localStorage.getItem('id_token');
    }

    // set token to localStorage and reload page to homepage
    login(idToken) {
        // saves token to localStorage
        localStorage.setItem('id_token', idToken);
        // send user to homepage & refresh page
        window.location.assign('/');
    }

    // clear token from localStorage and force logout/reload
    logout() {
        localStorage.removeItem('id_token');
        // send user to homepage & refresh page
        window.location.assign('/');
    }
}

export default new AuthService();