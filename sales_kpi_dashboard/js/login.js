document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Static credentials
    const validCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validate credentials
        if (username === validCredentials.username && password === validCredentials.password) {
            // Store authentication state
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());

            // Add success animation
            const button = e.target.querySelector('.btn-login');
            button.innerHTML = '<span>Success! Redirecting...</span>';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Show error
            showError('Invalid username or password');
            shakeForm();
        }
    });

    function showError(message) {
        // Remove existing error if any
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fee2e2;
            border: 2px solid #ef4444;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 600;
            animation: slideDown 0.3s ease-out;
        `;
        errorDiv.textContent = message;

        loginForm.insertBefore(errorDiv, loginForm.firstChild);

        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    function shakeForm() {
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s ease-out';
        setTimeout(() => {
            loginBox.style.animation = '';
        }, 500);
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);

    // Add input focus effects
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
