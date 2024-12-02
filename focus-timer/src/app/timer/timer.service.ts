import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { type Time } from "./timer.model";
import { environment } from "../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private timerStarted = signal<string>('');
    private apiUrl = environment.apiUrl;
    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    todayTimers = signal<Time|undefined>(undefined);

    constructor() {
        this.getTodayElapsedTime();
    }

    fetchTimerData() { 
        return this.httpClient.get<Time[]>(this.apiUrl + 'times').pipe();
    }

    onStartTimer(id: string) {
        console.log('[Started Timer]: ' + id);
        this.timerStarted.set(id);
    }

    onStopTimer(id:string, currentTimer: number) {
        if(this.timerStarted() === id)
            this.timerStarted.set('');
    }

    onTimerStarted(){
        return this.timerStarted.asReadonly();
    }

    getTodayElapsedTime() {
        const subscription = this.fetchTimerData()
        .subscribe({
          next: (data) => {
            this.todayTimers.set(data.find(timer => new Date(timer.date).toLocaleDateString() === new Date().toLocaleDateString()));
          },
          complete: () => {
            
          },
          error: (error) => {
            
          }
        });
    
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
    }

    setUpdatedElapsedTime(id: string, elapsedTime: number) {
        
    }
}