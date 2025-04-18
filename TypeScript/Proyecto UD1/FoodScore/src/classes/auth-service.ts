//Import constants
import { SERVER, USER_LOGIN_ENDPOINT, USER_REGISTER_ENDPOINT} from '../constants';
import { Http } from './http';

//Import interfaces
import { UserLogin, User } from '../interfaces/user';

export class AuthService {
    private _http: Http;

    constructor() {
        this._http = new Http();
    }

    //Function to login
    async login(userLogin: UserLogin): Promise<void> {
        try {
            await this._http.post(`${SERVER}${USER_LOGIN_ENDPOINT}`, userLogin);
        } catch (error) {
            console.error('Error al hacer login:', error);
            throw error;
        }
    }

    //Function to register
    async register(userInfo: User): Promise<void> {
        try {
            await this._http.post(`${SERVER}${USER_REGISTER_ENDPOINT}`, userInfo);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }

    //Function to logout
    public logout(): void {
        localStorage.removeItem("token");
        location.assign("login.html");
    }

    //Function to check if the token is valid
    async checkToken() : Promise<void>{
        try {
            await this._http.get<void>(`${SERVER}/auth/validate`);
        } catch (error) {
            console.log("No hay token o esta caducado" , error);
            location.assign("login.html");
        }
    }
}
