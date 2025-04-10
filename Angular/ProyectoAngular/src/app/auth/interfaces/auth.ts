export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}

export interface UserRegister {
    name: string;
    email: string;
    password: string;
    avatar: string;
    lat: number;
    lng: number;
}

export interface ExternalLogin {
    token: string;
    lat: number;
    lng: number;
}