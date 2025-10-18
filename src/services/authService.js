export const authService = {
  async login(user_name, password) {
    const response = await fetch('/api/webhook/c7b56cff-ff4f-45ee-b9a9-5c41a92fbc98', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name, password })
    });
    return response.json();
  },

  async register(username, password, email) {
    const response = await fetch('https://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    return response.json();
  }
};