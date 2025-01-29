import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  errorMessage: string = '';

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private animationId: number = 0;
  private lenis!: Lenis;

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @ViewChild('loginBox') loginBox!: ElementRef;
  @ViewChild('loginLeft') loginLeft!: ElementRef;
  @ViewChild('loginRight') loginRight!: ElementRef;

  constructor(private renderer2: Renderer2) { }

  ngOnInit(): void {
    this.initLenis();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animateEntrance();
    }, 500);
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

  /** Inizializza lo scroll fluido con Lenis */
  private initLenis(): void {
    this.lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  /** Animazione d'ingresso delle sezioni */
  private animateEntrance(): void {
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
      ease: 'power3.out'
    });
  
    gsap.to(rightElement, {
      x: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2  // Piccola differenza per un effetto più fluido
    });
  }

  /** Funzione per il login */
  login(): void {
    if ((!this.email && !this.phoneNumber) || !this.password) {
      this.errorMessage = 'Email/Telefono e password sono obbligatori';
      return;
    }

    console.log('Tentativo di login con:', {
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
    });
  }
}
