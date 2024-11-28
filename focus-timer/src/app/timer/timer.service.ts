import { inject, Injectable, signal } from "@angular/core";
import { TimerModel } from "./timer.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private timerStarted = signal<string>('');
    private apiUrl = 'assets/timers.json';
    private httpClient = inject(HttpClient);

    getTimerData() { 
        return this.httpClient.get<TimerModel[]>(this.apiUrl).subscribe();
    }

    onStartTimer(id: string) {
        console.log('[Started Timer]: ' + id);
        this.timerStarted.set(id);
    }

    onStopTimer(id:string) {
        if(this.timerStarted() === id)
            this.timerStarted.set('');
    }

    getTimerStarted(){
        return this.timerStarted.asReadonly();
    }

}