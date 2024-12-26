import { Component, computed, CreateEffectOptions, effect, inject, input, OnChanges, OnInit, signal, SimpleChange, SimpleChanges } from '@angular/core';
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
  private activityName = computed(() => this.title());
  private intervalId: any;
  public elapsedTime: number  = -1;
  public isRunning: boolean = false;
  // public isLoaded: boolean = false;
  private timerService = inject(TimerService);

  constructor() { 
    // stop this timer if another one was started 
    effect(() =>{
      const startedTimer = this.timerService.onTimerStarted();
        if(startedTimer() !== this.activityName() && this.isRunning){
          this.stop();
        }
      }, {
        allowSignalWrites: true
      });
      // load inital daily timer
    effect(() => {
      //console.log(this.timerService.todayTimers());
      if( this.timerService.todayTimers()?.find(timer => timer.activityName === this.activityName())?.timeSpent !== undefined)
        this.elapsedTime = this.timerService.todayTimers()?.find(timer => timer.activityName === this.activityName())?.timeSpent!;
    });       
  }

  get isLoaded(): boolean {
    return this.elapsedTime >= 0;
  }

  public start() {
    this.timerService.onStartTimer(this.activityName());    
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        this.elapsedTime += 10;
      }, 10);
    }
  }
  
  public stop() {
      this.timerService.onStopTimer(this.activityName());
      this.timerService.setUpdatedElapsedTime(this.activityName(), this.elapsedTime);
      clearInterval(this.intervalId);      
      this.isRunning = false;
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
