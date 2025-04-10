import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from '../interfaces/user';
import { UserResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  #profileUrl = 'users';
  #http = inject(HttpClient);

  getProfile(id: number): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#profileUrl}/${id}`)
      .pipe(map((resp) => resp.user));
  }

  getMyProfile(): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#profileUrl}/me`)
      .pipe(map((resp) => resp.user));
  }

  updateProfile(profile: UserProfileEdit): Observable<void> {
    return this.#http.put<void>(`${this.#profileUrl}/me`, profile);
  }

  updatePassword(password: UserPasswordEdit): Observable<void> {
    return this.#http.put<void>(`${this.#profileUrl}/me/password`, password);
  }

  updatePhoto(photo: UserPhotoEdit): Observable<void> {
    return this.#http.put<void>(`${this.#profileUrl}/me/avatar`, photo);
  }
}
