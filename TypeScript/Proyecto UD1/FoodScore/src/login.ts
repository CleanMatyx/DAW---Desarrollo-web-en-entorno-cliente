import { MyGeolocation } from './classes/my-geolocation';
import { Coordinates } from './interfaces/coordinates';
import { SERVER, USER_LOGIN_ENDPOINT } from './constants';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login') as HTMLFormElement;
  const errorInfo = document.getElementById('errorInfo') as HTMLParagraphElement;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorInfo.textContent = '';

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const coords: Coordinates = await MyGeolocation.getLocation();
      const response = await fetch(`${SERVER}${USER_LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        lat: coords.latitude,
        lng: coords.longitude,
      }),
    });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      window.location.href = 'index.html';
    } catch (error) {
      errorInfo.textContent = (error as Error).message;
    }
  });
});