import { Component, inject, OnInit } from '@angular/core';
import { TimerComponent } from "./timer/timer.component";
import { HeaderComponent } from "./header/header.component";
import { FirebaseComponent } from "./database/firebase/firebase.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimerComponent, HeaderComponent, FirebaseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
