import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { type Time } from "./timer.model";
import { environment } from "../environments/environment";
import { ActivatedRoute } from "@angular/router";

const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
const today = new Date().toLocaleDateString('en-CA', options);


@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private timerStarted = signal<string>('');
    private apiUrl = environment.apiUrl;
    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    todayTimers = signal<Time[]|undefined>(undefined);

    constructor() {
        this.getTodayElapsedTime();
    }

    fetchTimerData() { 
        return this.httpClient.get<Time[]>(this.apiUrl + 'user/times');
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
            console.log(data);
            this.todayTimers.set(data);
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
        const subscription = this.updateTimerData(id, elapsedTime).subscribe({
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

    updateTimerData(id: string, elapsedTime: number) {
        const timeEntry : Time = {
            activityName: id,
            timeSpent: elapsedTime,
            date: today,
            userId: '',
            id: ''
        };
        return this.httpClient.put(this.apiUrl + "times/update", timeEntry);
    }

}