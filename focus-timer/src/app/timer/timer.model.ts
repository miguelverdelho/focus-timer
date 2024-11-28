export interface TimerModel {
    date: Date,
    elapsedTimes :[
        {
            title:string,
            elapsedTime: number,
        }
    ]
}