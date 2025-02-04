import {Component, OnInit} from '@angular/core';
import {AreaUtenteService} from '../../service/area-utente.service';
import {CommonModule} from '@angular/common';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface Booking {
  bookingId: string;
  title: string;
  date: string;
  status: string;
}


@Component({
  selector: 'app-area-utente',
  templateUrl: './area-utente.component.html',
  styleUrls: ['./area-utente.component.css'],
  imports: [CommonModule],
})
export class AreaUtenteComponent implements OnInit {
  user: User | null = null;
  bookings: Booking[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private areaUtenteService: AreaUtenteService) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.areaUtenteService.fetchUserData().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        this.errorMessage = 'Errore durante il recupero dei dati utente.';
        console.error('Error fetching user data:', error);
      },
      complete: () => (this.isLoading = false),
    });

    this.areaUtenteService.fetchUserActiveBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Errore durante il recupero delle prenotazioni.';
        console.error('Error fetching bookings:', error);
        this.isLoading = false;
      },
    });
  }
}
