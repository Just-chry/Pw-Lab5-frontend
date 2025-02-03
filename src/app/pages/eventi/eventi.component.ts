import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  constructor(private eventsService: EventsService) {}

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

  participate(eventId: string): void {
    this.eventsService.createBooking(eventId).subscribe(
      (response) => {
        console.log('Booking created successfully', response);
        // Handle successful booking creation (e.g., show a success message)
      },
      (error) => {
        console.error('Error creating booking', error);
        // Handle error (e.g., show an error message)
      }
    );
  }
}
