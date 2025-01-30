import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import gsap from 'gsap';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy, AfterViewInit {
  contact: string = '';
  isEmail: boolean = true;
  password: string = '';
  errorMessage: string = '';

  showBothIcons: boolean = true;

  firstName: string = '';
  lastName: string = '';
  registerEmail: string = '';
  registerPhone: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  registrationErrorMessage: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isPasswordTyped: boolean = false;
  isRegistering: boolean = false;

  isLoginVisible: boolean = true;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private animationId: number = 0;
  private lenis!: Lenis;

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @ViewChild('loginBox') loginBox!: ElementRef;
  @ViewChild('loginLeft') loginLeft!: ElementRef;
  @ViewChild('loginRight') loginRight!: ElementRef;
  @ViewChild('registerBox') registerBox!: ElementRef;
  @ViewChild('registerLeft') registerLeft!: ElementRef;
  @ViewChild('registerRight') registerRight!: ElementRef;

  constructor(private renderer2: Renderer2, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initLenis();
  }

  ngAfterViewInit(): void {
    const fragment = this.route.snapshot.fragment;

    if (fragment === 'register') {
      this.isLoginVisible = false;
    } else {
      this.isLoginVisible = true;
    }

    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'register') {
        this.switchToRegister();
      } else {
        this.switchToLogin();
      }
    });

    this.animateEntranceLogin();
    this.animateEntranceRegister();
  }

  ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  validateInput(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d+$/;

    if (this.contact.length === 0) {
      this.showBothIcons = true;
    } else if (phonePattern.test(this.contact)) {
      this.showBothIcons = false;
      this.isEmail = false;
    } else {
      this.showBothIcons = false;
      this.isEmail = true;
    }
  }

  onPasswordInput(): void {
    this.isPasswordTyped = this.password.length > 0;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePasswords(): void {
    if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
      this.passwordError = 'Le password non coincidono.';
    } else {
      this.passwordError = '';
    }
  }

  private initLenis(): void {
    this.lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  private animateEntranceLogin(): void {
    if (!this.loginLeft || !this.loginRight) {
      console.error('Gli elementi non sono stati inizializzati correttamente!');
      return;
    }

    const leftElement = this.loginLeft.nativeElement;
    const rightElement = this.loginRight.nativeElement;

    if (!leftElement || !rightElement) {
      console.error('Elementi ViewChild non trovati!');
      return;
    }

    gsap.set(leftElement, { x: '-100%', opacity: 0 });
    gsap.set(rightElement, { x: '100%', opacity: 0 });

    gsap.to(leftElement, {
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.to(rightElement, {
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });
  }

  private animateEntranceRegister(): void {
    if (!this.registerLeft || !this.registerRight) {
      console.error('Gli elementi non sono stati inizializzati correttamente!');
      return;
    }

    const leftElement = this.registerLeft.nativeElement;
    const rightElement = this.registerRight.nativeElement;

    if (!leftElement || !rightElement) {
      console.error('Elementi ViewChild non trovati!');
      return;
    }

    gsap.set(leftElement, { x: '-100%', opacity: 0 });
    gsap.set(rightElement, { x: '100%', opacity: 0 });

    gsap.to(leftElement, {
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.to(rightElement, {
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });
  }

  switchToRegister(): void {
    this.isLoginVisible = false;
    this.animateSwitchToRegister();
    this.router.navigate([], { fragment: 'register' });
  }

  switchToLogin(): void {
    this.isLoginVisible = true;
    this.animateSwitchToLogin();
    this.router.navigate([], { fragment: 'login' });
  }

  animateSwitchToRegister(): void {
    this.registerBox.nativeElement.style.visibility = 'visible';

    const tl = gsap.timeline({
      onComplete: () => {
        this.loginBox.nativeElement.style.visibility = 'hidden';
      }
    });

    tl.to(this.loginBox.nativeElement, {
      x: '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out'
    });

    tl.fromTo(this.registerBox.nativeElement, {
      x: '-100%',
      opacity: 0
    }, {
      x: '0%',
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out'
    });
  }

  animateSwitchToLogin(): void {
    this.loginBox.nativeElement.style.visibility = 'visible';

    const tl = gsap.timeline({
      onComplete: () => {
        this.registerBox.nativeElement.style.visibility = 'hidden';
      }
    });

    tl.to(this.registerBox.nativeElement, {
      x: '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out'
    });

    tl.fromTo(this.loginBox.nativeElement, {
      x: '-100%',
      opacity: 0
    }, {
      x: '0%',
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out'
    });
  }

  login(): void {
    this.errorMessage = '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!this.contact || !this.password) {
      this.errorMessage = 'Email/Cellurare e password sono obbligatori';
      return;
    }

    if (!emailPattern.test(this.contact) && !phonePattern.test(this.contact)) {
      this.errorMessage = 'Inserisci un\'email o un numero di cellurare valido';
      return;
    }

    console.log('Tentativo di login con:', {
      contatto: this.contact,
      password: this.password,
    });

    this.simulateLogin();
  }

  simulateLogin(): void {
    setTimeout(() => {
      console.log('Login riuscito!');
    }, 1000);
  }

  validateRegisterInput(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10,15}$/;

    if (emailPattern.test(this.registerEmail)) {
      console.log('Email valida inserita');
    } else if (phonePattern.test(this.registerPhone)) {
      console.log('Numero di telefono valido inserito');
    } else {
      this.registrationErrorMessage = 'Inserisci un\'email o un numero di telefono valido';
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.registrationErrorMessage = 'Le password non coincidono';
    } else {
      this.registrationErrorMessage = '';
    }
  }

  register(): void {
    this.registrationErrorMessage = '';

    if (!this.firstName || !this.lastName) {
      this.registrationErrorMessage = 'Nome e cognome sono obbligatori';
      return;
    }

    if (!this.registerEmail && !this.registerPhone) {
      this.registrationErrorMessage = 'Inserisci almeno un\'email o un numero di telefono';
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.registrationErrorMessage = 'Le password non coincidono';
      return;
    }

    console.log('Tentativo di registrazione con:', {
      nome: this.firstName,
      cognome: this.lastName,
      email: this.registerEmail,
      telefono: this.registerPhone,
      password: this.registerPassword
    });

    this.simulateRegistration();
  }

  simulateRegistration(): void {
    setTimeout(() => {
      console.log('Registrazione riuscita!');
    }, 1000);
  }
}
