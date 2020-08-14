import { Injectable } from '@angular/core';
import { HttpErrorHandler } from '../../../util/http.error.handler';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RolTable } from './rol-table.model';

import { finalize, catchError } from 'rxjs/operators';
import { Rol } from '../model/rol.model';
import { MessageResponse } from '../model/message-response.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private url = 'api/rol';

  handler: HttpErrorHandler = new HttpErrorHandler();

  private loading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  connect(): Observable<boolean> {
    return this.loading.asObservable();
  }

  disconnet(): void {
    this.loading.complete();
  }

  getAllActivo(): Observable<Rol[]> {

    this.loading.next(true);

    return this.http.get<Rol[]>(this.url + '/getAllActivo')
      .pipe(finalize(() => { this.loading.next(false) }))
      .pipe(catchError(this.handler.handleError<Rol[]>('getAllActivo', [])));
  }

  getAllByUser(idUsuario: number): Observable<Rol[]> {

    this.loading.next(true);

    return this.http.get<Rol[]>(this.url + '/getAll/' + idUsuario)
      .pipe(finalize(() => { this.loading.next(false) }))
      .pipe(catchError(this.handler.handleError<Rol[]>('getAllByUsuario', [])));
  }

  getAllQueryRol(start: number, pageSize: number, filter: string, sortAsc: boolean, sortField: string): Observable<RolTable> {
    this.loading.next(true);

    let params = new HttpParams();

    if (filter)
      params = params.set('filter', filter);

    if (sortField)
      params = params.set('sortField', sortField);

    params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());

    return this.http.get<RolTable>(this.url + '/getAllQuery', { params })
      .pipe(finalize(() => { this.loading.next(false) }))
      .pipe(catchError(this.handler.handleError<RolTable>('getAllQueryRol', new RolTable())));
  }

  updateRol(rol: Rol): Observable<MessageResponse> {
    this.loading.next(true);
    return this.http.post<MessageResponse>(this.url + '/actualizar', rol)
      .pipe(finalize(() => { this.loading.next(false) }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('updateRol')));
  }

  createRol(rol: Rol): Observable<MessageResponse> {
    this.loading.next(true);
    return this.http.post<MessageResponse>(this.url + '/crear', rol)
      .pipe(finalize(() => { this.loading.next(false) }))
      .pipe(catchError(this.handler.handlePostError<MessageResponse>('createRol')));
  }


}