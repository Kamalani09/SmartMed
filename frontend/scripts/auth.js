// auth.js
const API_BASE = 'http://localhost:5000/api';

export function saveAuth(token, role, username) {
  localStorage.setItem('ms_token', token);
  localStorage.setItem('ms_role', role);
  localStorage.setItem('ms_user', username || '');
}

export function clearAuth() {
  localStorage.removeItem('ms_token');
  localStorage.removeItem('ms_role');
  localStorage.removeItem('ms_user');
}

export function getToken() {
  return localStorage.getItem('ms_token');
}

export function getRole() {
  return localStorage.getItem('ms_role');
}

export function authHeader() {
  const t = getToken();
  return t ? { 'Authorization': 'Bearer ' + t } : {};
}

export async function fetchJSON(url, opts = {}) {
  const headers = opts.headers || {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  opts.headers = { ...headers, ...authHeader() };
  const res = await fetch(API_BASE + url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
