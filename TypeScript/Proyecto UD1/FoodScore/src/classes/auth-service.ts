import { SERVER, USER_LOGIN_ENDPOINT, USER_REGISTER_ENDPOINT} from '../constants';
import { Http } from './http';
import { UserLogin, User } from '../interfaces/user';


export class AuthService {
    private _http: Http;

    constructor() {
        this._http = new Http();
    }

    async login(userLogin: UserLogin): Promise<void> {
        try {
            await this._http.post(`${SERVER}${USER_LOGIN_ENDPOINT}`, userLogin);
        } catch (error) {
            console.error('Error al hacer login:', error);
            throw error;
        }
    }

    async register(userInfo: User): Promise<void> {
        try {
            await this._http.post(`${SERVER}${USER_REGISTER_ENDPOINT}`, userInfo);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }
}
