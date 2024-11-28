import { Component, computed, CreateEffectOptions, effect, inject, input } from '@angular/core';
import { ButtonComponent } from '../shared/button/button.component';
import { TimerService } from './timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  title = input.required<string>();  
  private intervalId: any;
  public elapsedTime: number = 0;
  public isRunning: boolean = false;

  private timerService = inject(TimerService);

  otherTimerRunning = effect(() =>{
    const startedTimer = this.timerService.getTimerStarted();
      if(startedTimer() !== this.title()){
        this.stop();
      }
    }, {
      allowSignalWrites: true
    });

  public start() {
    this.timerService.onStartTimer(this.title());    
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        this.elapsedTime += 10;
      }, 10);
    }
  }

  public stop() {
    this.timerService.onStopTimer(this.title());
    if (this.isRunning) {
      clearInterval(this.intervalId);
      console.log('[Stopped Timer]: ' + this.title());
      this.isRunning = false;
    }
  }

  public formatTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const hundredSeconds = Math.floor((milliseconds % 1000) / 10);

    const paddedHours = this.padNumber(hours);
    const paddedMinutes = this.padNumber(minutes);
    const paddedSeconds = this.padNumber(seconds);
    const paddedHundredSeconds = this.padNumber(hundredSeconds);

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}.${paddedHundredSeconds}`;
  }

  private padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }

}