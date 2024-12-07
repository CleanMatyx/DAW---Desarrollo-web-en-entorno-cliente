import { MyGeolocation } from './classes/my-geolocation';
import { SERVER, USER_REGISTER_ENDPOINT } from './constants';

document.addEventListener('DOMContentLoaded', () => {
  const latInput = document.getElementById('lat') as HTMLInputElement;
  const lngInput = document.getElementById('lng') as HTMLInputElement;
  const errorInfo = document.getElementById('errorInfo') as HTMLParagraphElement;

  MyGeolocation.getLocation()
    .then((coords: GeolocationCoordinates) => {
      latInput.value = coords.latitude.toString();
      lngInput.value = coords.longitude.toString();
    })
    .catch((error: string) => {
      errorInfo.textContent = error;
      latInput.value = '0';
      lngInput.value = '0';
    });
});

document.getElementById('form-register')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const email = (form.email as HTMLInputElement).value;
  const email2 = (form.email2 as HTMLInputElement).value;
  const errorInfo = document.getElementById('errorInfo') as HTMLParagraphElement;

  if (email !== email2) {
    errorInfo.textContent = 'Los correos electrónicos no coinciden.';
    return;
  }

  const formData = new FormData(form);
  const fileInput = document.getElementById('photo') as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (!file) {
    errorInfo.textContent = 'No se ha seleccionado ninguna imagen';
    return;
  }

  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extraer solo la parte base64 sin el prefijo data:image/*;base64,
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = () => reject(new Error(`Error al leer la imagen: ${reader.error?.message}`));
  });

  const data = {
    name: formData.get('name') as string || 'Test user',
    email: formData.get('email') as string || 'test@test.com',
    password: formData.get('password') as string || '1234',
    lat: parseFloat(formData.get('lat') as string) || 37.423553,
    lng: parseFloat(formData.get('lng') as string) || -0.654657,
    avatar: base64Image
  };

  console.log(data);

  try {
    const response = await fetch(`${SERVER}${USER_REGISTER_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data, null, 2), // Formatear JSON con indentación
    });

    if (response.status === 201) {
      window.location.href = 'login.html';
    } else {
      const result = await response.json();
      errorInfo.textContent = result.message.join(', ');
    }
  } catch (error) {
    errorInfo.textContent = `Error al enviar el formulario. ${error}`;
  }
});

document.getElementById('photo')?.addEventListener('change', (event) => {
const fileInput = event.target as HTMLInputElement;
const file = fileInput.files?.[0];
const imgPreview = document.getElementById('imgPreview') as HTMLImageElement;

if (file) {
  const reader = new FileReader();
  reader.onload = () => {
    imgPreview.src = reader.result as string;
    imgPreview.classList.remove('d-none');
  };
  reader.readAsDataURL(file);
}
});