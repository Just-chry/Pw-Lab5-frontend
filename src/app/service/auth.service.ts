import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:8080/auth'; // Endpoint base
  private userUrl = 'http://localhost:8080/user'; // Endpoint base

  constructor(private http: HttpClient) {}

  login(loginData: LoginData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.authUrl}/login`, loginData, {
      headers,
      responseType: 'text',
      withCredentials: true,
    });
  }

  // API per inviare il codice di verifica
  forgottenPassword(emailOrPhone: string): Observable<any> {
    return this.http.post(`${this.userUrl}/forgottenPassword`, { emailOrPhone }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text',
    });
  }

  // API per verificare il codice di verifica
  verifyCode(emailOrPhone: string, verificationCode: string): Observable<any> {
    return this.http.post(
      `${this.userUrl}/verifyCode?emailOrPhone=${encodeURIComponent(emailOrPhone)}`,
      { verificationCode },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text',
      }
    );
  }

  // API per aggiornare la password
  updatePassword(emailOrPhone: string, newPassword: string, repeatNewPassword: string): Observable<any> {
    return this.http.post(
      `${this.userUrl}/updatePassword?emailOrPhone=${encodeURIComponent(emailOrPhone)}`,
      { newPassword, repeatNewPassword },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text',
      }
    );
  }

  register(registerData: RegistrationData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.authUrl}/register`, registerData, {
      headers,
      responseType: 'text',
    });
  }

  getUserSession(): Observable<{ userId: string }> {
    return this.http.get<{ userId: string }>('http://localhost:8080/user/session', { withCredentials: true });
  }

  getUserRole(userId: string): Observable<{ role: string,name:string }> {
    return this.http.get<{ role: string,name:string }>(`http://localhost:8080/user/${userId}`, { withCredentials: true });
  }
}



export interface LoginData {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}
