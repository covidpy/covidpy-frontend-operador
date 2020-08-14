import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ReporteSaludPaciente} from '../model/reporte-salud-paciente.model';
import {PagedList} from '../model/paged-list';
import {FieldInfo} from '../model/field-info';
import {flattenArray} from '../../../../util/flatten-array';
import {FirstTime} from '../model/first-time';

@Injectable({
  providedIn: 'root'
})
export class ReporteSaludPacienteService {

  public static readonly countHeader = 'x-total-count';

  url = 'api/covid19/reporte-salud';

  constructor(private http: HttpClient) { }

  getAll(page: number, pageSize: number, search?: string, sortDesc?: boolean, sortField?: string, filterList?: string[]): Observable<PagedList<ReporteSaludPaciente>> {

    let params = new HttpParams();

    if (sortField) {
      params = params.set('orderBy', sortField);
      params = params.set('orderDesc', String(sortDesc));
    }

    params = params
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())


    if (search) {
      params = params.set('search', search);
    }

    if (filterList && filterList.length > 0) {
      for (let filter of filterList) {
        params = params.append('filters', filter);
      }
    }
    return this.http.get<ReporteSaludPaciente[]>(this.url + '/', { params, observe: 'response'}).pipe(
      switchMap(r =>  r.ok ?
        of(new PagedList<ReporteSaludPaciente>(r.body, Number(r.headers.get(ReporteSaludPacienteService.countHeader)))) :
        throwError(r)
      ),
    );
  }

  downloadCSV(search?: string, sortField?: string, sortDesc?: boolean, filterList?: string[]): Observable<Blob> {

    let params = new HttpParams();

    if (sortField) {
      params = params.set('orderBy', sortField);
      params = params.set('orderDesc', sortDesc.toString());
    }

    if (filterList && filterList.length > 0) {
      for (let filter of filterList) {
        params = params.append('filters', filter);
      }
    }
    return this.http.get(this.url + "/csv/", {params, responseType: 'blob', observe: 'response' })
      .pipe(map((data: HttpResponse<Blob>) => {
        return new Blob([data.body], { type: 'text/csv;charset=utf-8' });
      }));

  }

  getForm(): Observable<FieldInfo[]> {
    return this.http.get<FieldInfo[][]>(this.url + "/form").pipe(
      map(fieldsArr =>  {
        const fields = flattenArray(fieldsArr);
        for (let f of fields) {
          if (typeof(f.optionsSource) === 'string' && (<string>f.optionsSource).startsWith("[")) {
            f.optionsSource = JSON.parse(f.optionsSource);
          }
        }
        return fields;
      })
    );
  }

  enviarReporteSalud(cedula: string, model: any): Observable<HttpResponse<any>> {
    return this.http.post(this.url + '/cedula/' + cedula, model, {observe: "response"});
  }

  getFirstTime(cedula: string): Observable<FirstTime> {
    return this.http.get<any>(this.url + '/primera-vez/' + cedula).pipe(
      map(r => {
        const f = new FirstTime();
        f.debeReportarFiebreAyer = r.debeReportarFiebreAyer.toString();
        f.esPrimeraVez = r.firstTime.toString();
        return f;
      }),
    );

  }

  getUltimoReporte(cedula: string): Observable<ReporteSaludPaciente> {
    return this.http.get<ReporteSaludPaciente>(this.url + '/ultimo-reporte/' + cedula);
  }
}
