document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        
        try {
            const btn = document.getElementById('registerBtn');
            btn.disabled = true;
            btn.textContent = 'Registering...';
            
            const result = await api.register(formData);
            
            showMessage('Registration successful! Email sent. Please login.', 'success');
            setTimeout(() => {
                window.location.href = '/frontend/login.html';
            }, 2000);
            
        } catch (error) {
            handleError(error);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Register';
        }
    });
    
    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        messageDiv.innerHTML = '';
    }
    
    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        errorEl.textContent = message;
    }
    
    function showMessage(message, type = 'error') {
        messageDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    }
    
    function handleError(error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already exists')) {
            showError('username', 'Username or email already taken');
        } else {
            showMessage(error.message);
        }
    }
});
