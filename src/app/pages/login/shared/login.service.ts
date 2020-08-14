import { Injectable } from '@angular/core';
import { HttpErrorHandler } from '../../../util/http.error.handler';
import { StorageManagerService } from './storage-manager.service';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../model/credentials.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsernamePassword } from '../model/username-password.model';

@Injectable(
  {providedIn: 'root'}
)
export class LoginService {

  private authenticationUrl = 'api/covid19/seguridad/gestion';

  private handler: HttpErrorHandler = new HttpErrorHandler();

  constructor(private http: HttpClient, private storageManager: StorageManagerService) { }


  doLogin(usernamePassword: UsernamePassword): Observable<Credentials> {
    return this.http.post<Credentials>(this.authenticationUrl, usernamePassword).pipe(catchError(this.handler.handleError<Credentials>('doLogin', new Credentials())));
  }

  doLogout() {
    this.storageManager.deleteStorage();
  }
}
