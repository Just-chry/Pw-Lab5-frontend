import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  errorMessage: string = '';

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sphere!: THREE.Mesh;
  private animationId: number = 0;
  private lenis!: Lenis;

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    // Animazioni GSAP (le gestiremo in seguito)
    gsap.from('.formContainer', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.imageContainer', { opacity: 0, y: 50, duration: 1, delay: 0.5 });

    // Inizializzazione di Three.js
    this.initThreeJS();

    // Inizializzazione di Lenis per lo scorrimento fluido
    this.initLenis();
  }

  ngOnDestroy(): void {
    // Pulizia del renderer di Three.js
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }

    // Annulla l'animazione
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Distruggi l'istanza di Lenis
    if (this.lenis) {
      this.lenis.destroy();
    }
  }

  // Gestione del ridimensionamento della finestra
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
  
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;
  
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  
    // Append del renderer al container specificato
    this.renderer2.appendChild(
      this.rendererContainer.nativeElement,
      this.renderer.domElement
    );
  
    // Aggiunta di luce ambientale per illuminare la sfera
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xa90202 });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  
    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.sphere.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  login(): void {
    if ((!this.email && !this.phoneNumber) || !this.password) {
      this.errorMessage = 'Email/Telefono e password sono obbligatori';
      return;
    }
    // Implementa il login
    console.log('Tentativo di login con:', {
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber
    });
  }
}
