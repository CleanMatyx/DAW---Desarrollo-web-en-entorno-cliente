import { SERVER, USER_LOGIN_ENDPOINT } from './constants';
import { TokenResponse, LoginError } from './interfaces/responses';

const formLogin = document.getElementById('form-login');

function login() {
    formLogin!.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const position = await getCurrentPosition();
            const formData = getFormData();
            const loginData = {
                email: formData.email,
                password: formData.password,
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const response = await sendLoginRequest(loginData);
            handleLoginSuccess(response);
        } catch (error: unknown) {
            if (error instanceof Error || (typeof error === 'object' && error !== null && 'status' in error && 'error' in error)) {
                handleLoginError(error as LoginError | Error);
            } else {
                handleLoginError(new Error('Unknown error occurred'));
            }
        }
    });
}
























// class Login {
//     private apiUrl = SERVER + USER_LOGIN_ENDPOINT;
//     private errorElement: HTMLElement;

//     constructor() {
//         this.errorElement = document.getElementById('errorInfo') as HTMLElement;
//         this.setupForm();
//     }

//     private setupForm(): void {
//         const form = document.querySelector('form');
//         form?.addEventListener('submit', (e) => this.handleSubmit(e));
//     }

//     private async handleSubmit(e: Event): Promise<void> {
//         e.preventDefault();
        
//         try {
//             const position = await this.getCurrentPosition();
//             const formData = this.getFormData();
            
//             const loginData = {
//                 email: formData.email,
//                 password: formData.password,
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             const response = await this.sendLoginRequest(loginData);
//             this.handleLoginSuccess(response);
//         } catch (error: unknown) {
//             if (error instanceof Error || (typeof error === 'object' && error !== null && 'status' in error && 'error' in error)) {
//                 this.handleLoginError(error as LoginError | Error);
//             } else {
//                 this.handleLoginError(new Error('Unknown error occurred'));
//             }
//         }
//     }

//     private getFormData(): { email: string; password: string } {
//         const email = (document.querySelector('input[name="email"]') as HTMLInputElement).value;
//         const password = (document.querySelector('input[name="password"]') as HTMLInputElement).value;
//         return { email, password };
//     }

//     private getCurrentPosition(): Promise<GeolocationPosition> {
//         return new Promise((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(resolve, reject);
//         });
//     }

//     private async sendLoginRequest(data: { email: string; password: string; lat: number; lng: number }): Promise<TokenResponse> {
//         const response = await fetch(this.apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if (!response.ok) {
//             const error = await response.json() as LoginError;
//             throw error;
//         }

//         return response.json() as Promise<TokenResponse>;
//     }

//     private handleLoginSuccess(response: TokenResponse): void {
//         localStorage.setItem('token', response.accessToken);
//         window.location.href = 'index.html';
//     }

//     private handleLoginError(error: LoginError | Error): void {
//         const errorMessage = 'error' in error ? error.error : 'Error durante el login';
//         this.errorElement.textContent = errorMessage;
//         this.errorElement.style.display = 'block';
//     }
// }

// // Inicializar cuando el DOM esté listo
// document.addEventListener('DOMContentLoaded', () => {
//     new Login();
// });