import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, distinctUntilChanged, finalize, map, share, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {calendarEsLocale} from '../../../../util/calendar-es-locale';
import {FieldInfo} from '../model/field-info';
import {ReporteSaludPacienteService} from '../shared/reporte-salud-paciente.service';
import {Location} from '@angular/common';
import {FirstTime} from '../model/first-time';
import {HttpErrorResponse, HttpResponseBase} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-actualizar-estado-salud',
  templateUrl: './actualizar-estado-salud.component.html',
  styleUrls: ['./actualizar-estado-salud.component.css']
})
export class ActualizarEstadoSaludComponent implements OnInit, OnDestroy {
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

    const firstTime$ = this.cedula$.pipe(
      switchMap(cedula => this.getPrimeraVez(cedula)),
    );

    this.form$ = combineLatest(this.fields$, firstTime$).pipe(
      map(([fields, firstTime]) => {
          const form = this.fb.group(fields.reduce((obj, f) => {
            obj[f.fieldName] = [null];
            return obj;
          }, {}));
          form.addControl('esPrimeraVez', this.fb.control(firstTime.esPrimeraVez));
          form.addControl('debeReportarFiebreAyer', this.fb.control(firstTime.debeReportarFiebreAyer));
          return form;
      }),
      share(),
    );

    this.saveClick$
      .pipe(
        withLatestFrom(
          this.cedula$,
          this.form$,
        ),
        tap(([_, __, form]) => {
          form.markAsDirty();
          this.errores = null;
        }),
        switchMap(([_, cedula, form]) => this.save(cedula, form.value)),
        takeUntil(this.onDestroy$),
      ).subscribe(
      (r) => {
        if (r.ok) {
          this.location.back()
        } else if (r.status === 400) {
          const response = <HttpErrorResponse>r;
          if (response.error.parameterViolations) {
            this.errores = response.error.parameterViolations.reduce((validation, currentValidation) =>  {
              const split = currentValidation.path.split(".");
              if (!validation[split[split.length - 1]]) {
                validation[split[split.length - 1]] = [];
              }
              validation[split[split.length - 1]].push(
                currentValidation.message
              );
              return validation;
            }, {});
          }
        }
      }
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

  save(cedula, model): Observable<HttpResponseBase> {
    this.loading = true;
    return this.reporteSaludPacienteService.enviarReporteSalud(cedula, model)
      .pipe(
        catchError<HttpResponseBase, HttpResponseBase>((err) => {
          console.log('catchError', err);
          return of(err);
        }),
        finalize(() => {
          this.loading = false;
        }),
        share(),
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


  getPrimeraVez(cedula: string): Observable<FirstTime>{
    return this.reporteSaludPacienteService.getFirstTime(cedula).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        }
        throw err;
      }),
      share(),
    );
  }

  onSaveClick() {
    this.saveClick$.next();

  }
}
