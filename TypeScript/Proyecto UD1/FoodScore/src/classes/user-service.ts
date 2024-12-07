import { SERVER } from "../constants";
import { AvatarResponse, SingleUserResponse } from "../interfaces/responses";
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from "../interfaces/user";
import { Http } from "./http";

const userTemplate: Handlebars.TemplateDelegate = Handlebars.compile("../templates/profile.hbs");

export class UserService {
    private http : Http;

    constructor(){
        this.http = new Http();
    }

    async getProfile(id? : number) : Promise<User> {
        let result : SingleUserResponse;
        if(id){            
            result = await this.http.get<SingleUserResponse>(`${SERVER}/users/${id}`);
        }else{            
            result = await this.http.get<SingleUserResponse>(`${SERVER}/users/me`);
        }
        return result.user;
    }

    async savePhoto(photo: string): Promise<string>{
       const result = await this.http.put<AvatarResponse , UserPhotoEdit>(`${SERVER}/users/me/avatar`,{avatar : photo} );
        return result.avatar;
    }

    async saveProfile(name : string , email : string) : Promise<void>{
        return this.http.put<void , UserProfileEdit>(`${SERVER}/users/me`,{email : email , name : name} );
    }

    async savePassword(password : string) : Promise<void>{
        return this.http.put<void , UserPasswordEdit>(`${SERVER}/users/me/password`,{password : password});
    }

    async getMyProfile(): Promise<User> {
        console.log("user-service: getMyProfile;");
        const resp = this.http.get<SingleUserResponse>(SERVER + "/users/me");

        return (await resp).user;
    }

    userToHTML(user: User): string | Node {
        //console.log(user);
        const col: HTMLDivElement = document.createElement("div");
        const restHTML = userTemplate({ ...user });
        col.innerHTML = restHTML;
        if (col.firstChild) {
            return col.firstChild;
        } else {
            throw new Error("No child node found");
        }
    }
}
