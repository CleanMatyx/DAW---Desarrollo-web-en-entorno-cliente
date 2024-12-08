//Import constants and Http class
import { SERVER } from "../constants";
import { Http } from "./http";

//Import interfaces
import { AvatarResponse, SingleUserResponse } from "../interfaces/responses";
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from "../interfaces/user";


export class UserService {
    private http : Http;

    constructor(){
        this.http = new Http();
    }

    //Get user profile
    async getProfile(id?: number | string): Promise<User> {
        let res;
        if(id){            
            res = await this.http.get<SingleUserResponse>(`${SERVER}/users/${id}`);
        }else{            
            res = await this.http.get<SingleUserResponse>(`${SERVER}/users/me`);
        }

        return res.user;
    }

    //Save user photo
    async savePhoto(photo: string): Promise<string>{
       const res = await this.http.put<AvatarResponse , UserPhotoEdit>(`${SERVER}/users/me/avatar`,{avatar : photo} );
        return res.avatar;
    }

    //Save user profile
    async saveProfile(name : string , email : string) : Promise<void>{
        return this.http.put<void , UserProfileEdit>(`${SERVER}/users/me`,{email : email , name : name} );
    }

    //Save user password
    async savePassword(password : string) : Promise<void>{
        return this.http.put<void , UserPasswordEdit>(`${SERVER}/users/me/password`,{password : password});
    }

    // //Change user password
    // async changePassword(password : string) : Promise<void>{
    //     return this.http.put<void , UserPasswordEdit>(`${SERVER}/users/me/password`,{password : password});
    // }

    // //Update user profile
    // async updateProfile(name: string, email: string): Promise<User> {
    //     try {
    //         const response = await this.http.put<User, UserProfileEdit>(`${SERVER}/users/me`, { email: email, name: name });
    //         return response;
    //     } catch (error) {
    //         console.error('Error updating profile:', error);
    //         throw error;
    //     }
    // }
}
