import { Component, inject } from '@angular/core';
import { TimerService } from '../timer/timer.service';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [TimerComponent],
  templateUrl: './timers.component.html',
  styleUrl: './timers.component.scss'
})
export class TimersComponent {
  public timerService = inject(TimerService);

  constructor () { 
    this.timerService.getTodayElapsedTime();
  }
}
