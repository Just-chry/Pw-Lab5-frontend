import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  maxParticipants: number;
  participantsCount: number;
  remaining?: number;
  bookingMessage?: string;  // Aggiunta del messaggio di prenotazione
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:8080/events';
  private bookingUrl = 'http://localhost:8080/bookings';

  constructor(private http: HttpClient) {
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map(events =>
        events.map(event => {
          const maxParticipants = event.maxParticipants;
          const participantsCount = event.participantsCount;
          return {
            ...event,
            date: new Date(event.date),
            remaining: maxParticipants - participantsCount
          };
        })
      )
    );
  }

  getEventById(id: number): Observable<Event> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Event>(url).pipe(
      map(event => {
        const maxParticipants = event.maxParticipants;
        const participantsCount = event.participantsCount;
        return {
          ...event,
          date: new Date(event.date),
          remaining: maxParticipants - participantsCount
        };
      })
    );
  }

  createBooking(eventId: string): Observable<any> {
    const url = `${this.bookingUrl}/${eventId}`;

    return this.http.post<any>(url, null, { withCredentials: true }).pipe(
      map(response => {
        return { success: true, message: 'Booking created successfully', data: response };
      }),
      catchError(error => {
        console.error('Error response:', error);
        let errorMessage = 'Failed to create booking';
        if (error.status === 409) {  // Gestione stato 409 CONFLICT
          errorMessage = 'Hai già una prenotazione attiva per questo evento';
        } else if (error.status === 404) {
          errorMessage = 'Utente non trovato';
        } else if (error.status === 204) {
          errorMessage = 'Nessun contenuto disponibile per questo evento';
        }
        return of({ success: false, message: errorMessage, error });
      })
    );
  }
}
