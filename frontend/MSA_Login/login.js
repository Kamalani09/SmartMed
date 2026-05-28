// login.js
import { fetchJSON, saveAuth } from '../scripts/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', loginUser);
});

async function loginUser(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    return alert('Enter credentials');
  }

  try {
    const res = await fetch(
      'https://smartmed-dmrb.onrender.com/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save auth
    localStorage.setItem('ms_token', data.token);
    localStorage.setItem('ms_role', data.role);
    localStorage.setItem('ms_user', data.username || '');

    // If auth.js helper exists
    if (saveAuth) {
      saveAuth(data.token, data.role, data.username);
    }

    // Redirect by role
    if (data.role === 'owner') {
      window.location.href = '../owner/dashboard.html';
    } else if (data.role === 'vendor') {
      window.location.href = '../vendor/vendorDashboard.html';
    } else {
      window.location.href = '../customer/customerDashboard.html';
    }

  } catch (err) {
    console.error(err);
    alert(err.message || 'Login failed');
  }
}
