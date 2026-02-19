// FRONTEND API JS
// This version works with Nginx proxy setup (relative URLs)

const API_BASE = '/api';  // <-- Relative URL, no port needed. Nginx proxies /register, /login etc. to Flask

class StoresAPI {
    async register(userData) {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        return response.json();
    }
    
    async login(credentials) {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        return response.json();
    }

    async addItem(itemdetails) {
        const response = await fetch(`${API_BASE}/item`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(itemdetails)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Fail To Add Item');
        }

        return response.json();
    }

    async addImage(imagedetails) {
        const response = await fetch(`${API_BASE}/upload-image`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: imagedetails
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload image');
        }

        return response.json();
    }
    
    setAuthToken(token) {
        localStorage.setItem('access_token', token);
    }
    
    getAuthToken() {
        return localStorage.getItem('access_token');
    }
    
    clearAuthToken() {
        localStorage.removeItem('access_token');
    }
}

const api = new StoresAPI();


// const API_BASE = 'http://localhost:5001';  // Your Flask API

// class StoresAPI {
//     async register(userData) {
//         const response = await fetch(`${API_BASE}/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             body: JSON.stringify(userData)
//         });
        
//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.message || 'Registration failed');
//         }
        
//         return response.json();
//     }
    
//     async login(credentials) {
//         const response = await fetch(`${API_BASE}/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(credentials)
//         });
        
//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.message || 'Login failed');
//         }
        
//         return response.json();
//     }
    
//     setAuthToken(token) {
//         localStorage.setItem('access_token', token);
//     }
    
//     getAuthToken() {
//         return localStorage.getItem('access_token');
//     }
    
//     clearAuthToken() {
//         localStorage.removeItem('access_token');
//     }
// }

// const api = new StoresAPI();