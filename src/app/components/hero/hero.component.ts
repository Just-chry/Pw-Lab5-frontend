import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { EventCardComponent } from "../event-card/event-card.component";

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: true,
  imports: [EventCardComponent],
})
export class HeroComponent implements AfterViewInit {
  public currentCardIndex: number = 0
  
  constructor(private router: Router) { }

  viewEvent(eventId: number): void {
    console.log('Visualizzazione dettagli evento:', eventId);
  }

  ngAfterViewInit(): void {
    this.animateHeroContent();
  }

  animateHeroContent(): void {
    gsap.from('.hero-text-section', {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power3.out',
    });

    gsap.from('.event-card.active', {
      opacity: 0,
      x: -100,
      duration: 1.5,
      ease: 'power3.out',
    });
  }

  switchCard(index: number): void {
    this.currentCardIndex = index;
  }

  onGetStarted(): void {
    this.router.navigate(['/about']);
  }

  scrollToNextSection(): void {
    const nextSection = document.querySelector('.next-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  }
}