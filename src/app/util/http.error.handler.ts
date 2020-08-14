import { Observable, of } from "rxjs";

export class HttpErrorHandler {


    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error('Operation: ' + operation + ' Status code: ' + error.status);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    handlePostError<T>(operation = 'operation') {
        return (error: any): Observable<T> => {
            console.error('Operation: ' + operation + ' Status code: ' + error.status);
            return of(error.error as T);
        };
    }
}