import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from '@studio-freight/lenis';

@Injectable({ providedIn: 'root' })
export class LenisScrollService {
  private lenis!: Lenis;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.lenis = new Lenis({
        smooth: true,
        lerp: 0.1, // Controlla la fluidità dello scroll
        wheelMultiplier: 1.2, // Aumenta la reattività dello scroll
        infinite: false // Se vuoi un loop infinito dello scroll, mettilo a true
      });

      const raf = (time: number) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }
}
