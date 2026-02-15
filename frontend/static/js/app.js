document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm')
    const messageDiv = document.getElementById('message');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            const btn = document.getElementById('registerBtn');

            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                btn.disabled = true;
                btn.textContent = 'Registering...';

                const result = await api.register(formData);

                showMessage('Registration successful! Email sent. Please login.', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);

            } catch (error) {
                handleError(error);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Register';
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            clearErrors();

            const btn = document.getElementById('loginBtn');

            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            try {
                btn.disabled = true;
                btn.textContent = 'Login...'

                const result = await api.login(formData);

                // Save token for API calls on home page
                if (result.access_token) {
                    api.setAuthToken(result.access_token);
                }

                showMessage('Login Successfull !!!')
                setTimeout(() => {
                    window.location.href = '/home.html';
                },2000);
            } catch (error) {
                handleError(error);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Login'
            }
        })
    }
    

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        if (messageDiv) {
            messageDiv.innerHTML = '';
        }
    }
    
    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        if (errorE1) {
            errorEl.textContent = message;
        }
    }
    
    function showMessage(message, type = 'error') {
        if (!messageDiv) return;
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

