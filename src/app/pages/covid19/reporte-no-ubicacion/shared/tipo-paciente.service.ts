import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {finalize, catchError, map} from 'rxjs/operators';
import {ReporteNoUbicacionModel} from "../model/reporte-no-ubicacion.model";
import { HttpErrorHandler } from 'app/util/http.error.handler';

@Injectable()
export class TipoPacienteService  {

  url = 'api/covid19/tipopaciente';

  constructor(private http: HttpClient, private handler: HttpErrorHandler) {

  }

  getAll(sortField: string, filterList: string[]): Observable<any> {

    let params = new HttpParams();

    if (sortField)
      params = params.set('orderBy', sortField);

    if(filterList && filterList.length > 0) {
      for (let filter of filterList) {
        params = params.append('filters', filter);
      }
    }

    return this.http.get<any>(this.url + '/', { params, observe: 'response'})
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handleError<any>('getAll', new Array<ReporteNoUbicacionModel>())));
  }

}
