import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {FieldInfo} from '../model/field-info';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ReporteSaludPacienteService} from '../shared/reporte-salud-paciente.service';
import {Location} from '@angular/common';
import {catchError, distinctUntilChanged, finalize, map, share, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {HttpErrorResponse, HttpResponseBase} from '@angular/common/http';
import {FirstTime} from '../model/first-time';
import {ReporteSaludPaciente} from '../model/reporte-salud-paciente.model';

@Component({
  selector: 'app-visualizar-estado-salud',
  templateUrl: './visualizar-estado-salud.component.html',
  styleUrls: ['./visualizar-estado-salud.component.css']
})
export class VisualizarEstadoSaludComponent implements OnInit, OnDestroy {

  cedula$: Observable<string>;


  fields$: Observable<FieldInfo[]>;
  private onDestroy$ = new Subject<void>();

  loading: boolean;
  private saveClick$ = new Subject<void>();
  errores: any;
  form$: Observable<FormGroup>;

  constructor(
    private activeRoute: ActivatedRoute,
    private reporteSaludPacienteService: ReporteSaludPacienteService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.cedula$ = this.activeRoute.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('cedula')),
      distinctUntilChanged(),
    );
    this.fields$ = this.getForm();

    const ultimoReporte$ = this.cedula$.pipe(
      switchMap(cedula => this.getUltimoReporte(cedula))
    );

    this.form$ = combineLatest(this.fields$, ultimoReporte$).pipe(
      map(([fields, ultimoReporte]) => {
        const form = this.fb.group(fields.reduce((obj, f) => {
          obj[f.fieldName] = [ultimoReporte[f.fieldName]];
          return obj;
        }, {}));
        form.addControl('esPrimeraVez', this.fb.control(ultimoReporte.esPrimeraVez));
        form.addControl('debeReportarFiebreAyer', this.fb.control(ultimoReporte.debeReportarFiebreAyer));
        form.disable();
        return form;
      }),
      share(),
    );

  }

  goBack() {
    this.location.back();
  }

  getForm(): Observable<FieldInfo[]> {
    return this.reporteSaludPacienteService.getForm().pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        }
        throw err;
      }),
      share(),
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getUltimoReporte(cedula): Observable<ReporteSaludPaciente> {
    return this.reporteSaludPacienteService.getUltimoReporte(cedula).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        }
        throw err;
      }),
      share(),
    );
  }
}
