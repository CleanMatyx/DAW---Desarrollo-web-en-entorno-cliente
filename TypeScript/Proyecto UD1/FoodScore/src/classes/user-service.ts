import { SERVER } from "../constants";
import { AvatarResponse, SingleUserResponse } from "../interfaces/responses";
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from "../interfaces/user";
import { Http } from "./http";

export class UserService {
    private http : Http;

    constructor(){
        this.http = new Http();
    }

    async getProfile(id?: number | string): Promise<User> {
        let res;
        if(id){            
            res = await this.http.get<SingleUserResponse>(`${SERVER}/users/${id}`);
        }else{            
            res = await this.http.get<SingleUserResponse>(`${SERVER}/users/me`);
        }

        return res.user;
    }

    async savePhoto(photo: string): Promise<string>{
       const res = await this.http.put<AvatarResponse , UserPhotoEdit>(`${SERVER}/users/me/avatar`,{avatar : photo} );
        return res.avatar;
    }

    async saveProfile(name : string , email : string) : Promise<void>{
        return this.http.put<void , UserProfileEdit>(`${SERVER}/users/me`,{email : email , name : name} );
    }

    async savePassword(password : string) : Promise<void>{
        return this.http.put<void , UserPasswordEdit>(`${SERVER}/users/me/password`,{password : password});
    }

    async changePassword(password : string) : Promise<void>{
        return this.http.put<void , UserPasswordEdit>(`${SERVER}/users/me/password`,{password : password});
    }

    async updateProfile(name: string, email: string): Promise<User> {
        try {
            const response = await this.http.put<User, UserProfileEdit>(`${SERVER}/users/me`, { email: email, name: name });
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
}
