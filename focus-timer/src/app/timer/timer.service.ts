import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { type Time } from "./timer.model";
import { environment } from "../environments/environment";

const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: '2-digit', year: 'numeric' };
const today = new Date().toLocaleDateString('en-GB', options); // Use 'en-GB' for DD/MM/YYYY format


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
        return this.httpClient.get<Time[]>(this.apiUrl + 'times');
    }

    onStartTimer(id: string) {
        this.timerStarted.set(id);
    }

    onStopTimer(id:string) {
        if(this.timerStarted() === id){
            this.timerStarted.set('');
        }
    }

    onTimerStarted(){
        return this.timerStarted.asReadonly();
    }

    getTodayElapsedTime() {
        const subscription = this.fetchTimerData()
        .subscribe({
          next: (data) => {
            let timers = Object.values(data).find(x => x.date === today);
            this.todayTimers.set(timers);
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
        const subscription = this.pushTimerData(id, elapsedTime).subscribe({
          next: (data) => {
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

    pushTimerData(id: string, elapsedTime: number) {
        return this.httpClient.put(this.apiUrl + 'times' + '/update/' + today.replace(/\//g, '-') + '/' + id, { elapsedTime });
    }
}