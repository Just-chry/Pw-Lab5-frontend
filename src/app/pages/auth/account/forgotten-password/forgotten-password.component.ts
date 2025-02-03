import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ForgotPasswordComponent {
  currentStep: number = 1;
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isPasswordTyped: boolean = false;

  // Validate email format
  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      console.warn('Invalid email address.');
    }
  }

  // Step 1: Send email to user
  sendEmail() {
    if (!this.email) {
      console.error('Email is required.');
      return;
    }
    console.log('Sending email to:', this.email);
    this.currentStep = 2;
  }

  // Validate the verification code
  validateCode() {
    if (this.verificationCode.length < 6) {
      console.warn('Verification code should be at least 6 characters.');
    }
  }

  // Step 2: Submit the verification code
  sendCode() {
    if (!this.verificationCode) {
      console.error('Verification code is required.');
      return;
    }
    console.log('Verification code submitted:', this.verificationCode);
    this.currentStep = 3;
  }

  // Handle password input to manage visibility icon
  onPasswordInput() {
    this.isPasswordTyped = !!this.newPassword;
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Step 3: Update the password
  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      console.error('Both password fields are required.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }
    console.log('Password successfully updated.');
    this.switchToLogin();
  }

  // Redirect to login page or home
  switchToLogin() {
    console.log('Redirecting to login page...');
    // Implement your routing logic here if needed
  }
}
