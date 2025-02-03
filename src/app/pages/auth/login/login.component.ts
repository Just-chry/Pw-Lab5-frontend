import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class LoginComponent {
  emailOrPhone: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.emailOrPhone || !this.password) {
      this.errorMessage = 'Inserisci email/telefono e password.';
      return;
    }

    const credentials: LoginData = {
      emailOrPhone: this.emailOrPhone,
      password: this.password,
      rememberMe: this.rememberMe
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login riuscito:', response);
        this.router.navigate(['/area-utente']);
      },
      error: (err) => {
        console.error('Errore di login:', err);
        this.errorMessage = 'Credenziali errate o errore di connessione.';
      },
    });
  }

  forgotPassword(): void {
    if (!this.emailOrPhone) {
      this.errorMessage = 'Inserisci l\'email o il telefono per recuperare la password.';
      return;
    }

    this.authService.forgottenPassword(this.emailOrPhone).subscribe({
      next: (response) => {
        console.log('Codice di verifica inviato:', response);
        this.successMessage = 'Codice di verifica inviato con successo.';
        this.errorMessage = ''; // Reset error message
      },
      error: (err) => {
        console.error('Errore durante il recupero della password:', err);
        this.errorMessage = 'Impossibile inviare il codice di verifica. Verifica che l\'email o il telefono siano corretti.';
        this.successMessage = ''; // Reset success message
      },
    });
  }
}
