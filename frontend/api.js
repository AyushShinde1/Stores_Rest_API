const API_BASE = '/api';  // <-- Relative URL, no port needed. Nginx proxies /register, /login etc. to Flask

class StoresAPI {
        async getStoreId(storename) {
            const response = await fetch(`${API_BASE}/store/name/${storename}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error("Store not found");
            }

            const data = await response.json();
            return data.store; // because backend returns { "store": store.id }
        }


        async getTagId(tagname) {
            const response = await fetch(`${API_BASE}/tag/name/${tagname}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error("Tag not found");
            }

            const data = await response.json();
            return data.tag; // because backend returns { "store": store.id }
        }

    /*################################
        User API
    ################################*/

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
    
    /*################################
        Item API
    ################################*/

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

    /*################################
        Store API
    ################################*/

    async addStore(storeData) {
      const response = await fetch(`${API_BASE}/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add store");
      }
      return response.json();
    }

    async addStoreImage(formData) {
      const response = await fetch(`${API_BASE}/upload-store-image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.getAuthToken()}`
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload store image");
      }
      return response.json();
    }
    
    /*################################
        Tag API
    ################################*/

    async LinkTagToStore(tagdetails) {
        const response = await fetch(`${API_BASE}/store/${tagdetails.store_id}/tag`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({name: tagdetails.name})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Fail To Add Item');
        }

        return response.json();
    }

    
    async LinkTagToItem(tagdetails) {
        const response = await fetch(`${API_BASE}/item/${tagdetails.item_id}/tag/${tagdetails.tag_id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(tagdetails)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Fail To Add Item');
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