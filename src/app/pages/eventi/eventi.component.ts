import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EventsService, Event } from '../../service/events.service';

@Component({
  selector: 'app-eventi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eventi.component.html',
  styleUrls: ['./eventi.component.css'],
})
export class EventiComponent implements OnInit {
  events: Event[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  get filteredEvents(): Event[] {
    return this.events.filter((event) => {
      const matchesSearch =
        !this.searchTerm ||
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || event.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  isPastEvent(event: Event): boolean {
    return new Date(event.date) < new Date();
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  participate(eventId: string): void {
    this.eventsService.createBooking(eventId, '').subscribe(
      (response) => {
        console.log('Booking created successfully', response);
      },
      (error) => {
        console.error('Error creating booking', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/auth/account'], {
            queryParams: { message: 'Please log in to book an event' },
          });
        }
      }
    );
  }

}
