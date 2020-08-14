import { Injectable } from '@angular/core';
import { HttpErrorHandler } from '../../../util/http.error.handler';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UsuarioTable } from './usuario-table.model';
import { finalize, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { MessageResponse } from '../model/message-response.model';
import { UsernamePassword } from '../../login/model/username-password.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService  {

  url = 'api/usuario';

  constructor(private http: HttpClient, private handler: HttpErrorHandler) {

  }

  getAllQueryUsuario(start: number, pageSize: number, filter: string, sortAsc: boolean, sortField: string): Observable<UsuarioTable> {

    let params = new HttpParams();

    if (filter)
      params = params.set('filter', filter);

    if (sortField)
      params = params.set('sortField', sortField);

    params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());

    return this.http.get<UsuarioTable>(this.url + '/getAllQuery', { params })
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handleError<UsuarioTable>('getAllQueryUsuario', new UsuarioTable())));
  }

  updateUser(usuario: Usuario): Observable<MessageResponse> {

    return this.http.post<MessageResponse>(this.url + '/actualizar', usuario)
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('updateUser')));
  }

  updateRols(usuario: Usuario): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.url + '/actualizarRoles', usuario)
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('updateUserRols')));
  }

  createUser(usuario: Usuario): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.url + '/crear', usuario)
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('createUser')));
  }

  sendPasswordEmail(usuario: Usuario) {
    return this.http.post<MessageResponse>(this.url + '/enviarCorreo', usuario)
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('sendPasswordEmail')));
  }

  changePassword(token: string, c: UsernamePassword) {
    return this.http.post<MessageResponse>(this.url + '/cambiarClave/' + token, c)
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('changePassword')));
  }

}
