export interface Time {
    date: string,
    elapsedTimes :[
        {
            activityName:string,
            timeSpent: number,
        }
    ]
}