import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Endpoint base

  constructor(private http: HttpClient) {}

  login(loginData: LoginData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/login`, loginData, {
      headers,
      responseType: 'text',
      withCredentials: true
    });
  }

  forgottenPassword(emailOrPhone: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/forgottenPassword`, { emailOrPhone }, {
      headers,
      responseType: 'text'
    });
  }

  register(registerData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, registerData, {
      headers,
      responseType: 'text'
    });
  }
}

export interface LoginData {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}
