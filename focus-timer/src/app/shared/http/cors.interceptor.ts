import { HttpRequest, HttpEvent, HttpHandlerFn, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function intercept(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    
    console.log("Intercepted");
    const modifiedRequest = request.clone({
        setHeaders: {
            'Content-Type': 'application/json'
        }
    });
    return next(modifiedRequest).pipe(
        tap({
            next: (event) => {
                if(event.type === HttpEventType.Response){
                    console.log('[Incoming Response]');
                    console.log(event.status);
                    console.log(event.body);
                }
            }
        })
    );
}