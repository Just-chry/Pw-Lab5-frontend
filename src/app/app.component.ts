import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent]
})
export class AppComponent {
  title = 'Varese Developer Group';

  hideHeaderFooter: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      // Nasconde header e footer per le pagine di login e registrazione
      this.hideHeaderFooter = currentRoute === '/auth/login' || currentRoute === '/auth/register';
    });
  }
}
