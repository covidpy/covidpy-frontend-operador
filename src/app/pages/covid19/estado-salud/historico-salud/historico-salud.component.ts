import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {catchError, distinctUntilChanged, finalize, map, share, startWith, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, fromEvent, Observable, Subject, Subscription} from 'rxjs';
import {ReporteSaludPaciente} from '../model/reporte-salud-paciente.model';
import {ReporteSaludPacienteService} from '../shared/reporte-salud-paciente.service';
import {Message} from 'primeng/api';
import {ReporteNoUbicacionModel} from '../../reporte-no-ubicacion/model/reporte-no-ubicacion.model';
import {ReporteNoUbicacionSearch} from '../../reporte-no-ubicacion/model/reporte-no-ubicacion.search';
import {Table} from 'primeng/table';
import {PagedList} from '../model/paged-list';
import {DatePipe, Location} from '@angular/common';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-historico-salud',
  templateUrl: './historico-salud.component.html',
  styleUrls: ['./historico-salud.component.css']
})
export class HistoricoSaludComponent implements OnInit, OnDestroy {

  @ViewChild('table') table: Table;

  msgs: Message[] = [];
  block: boolean;
  pageSize: number = 10;
  start: number = 0;
  search: string;
  totalRecords$: Observable<number>;
  loading = true;
  error = false;
  private loadSubsciption: Subscription;
  filterList: string[] = [];
  advancedSearch: ReporteNoUbicacionSearch;

  cedula$: Observable<string>;
  historico$: Observable<ReporteSaludPaciente[]>;
  private load$: Observable<any>;
  start$: Observable<number>;
  onCsvDownload$ = new Subject<void>();
  onDestroy$ = new Subject<void>();

  private readonly defaultOrder = 'timestampCreacion';
  private readonly defaultOrderDesc = true;

  cols = [
    { field: 'timestampCreacion', header: 'Fecha del reporte', width: '150px', sort: true, isDate: true, },
    { field: 'comoTeSentis', header: 'Cómo te sentís?', width: '120px',  sort: true, },
    { field: 'signosSintomasDescritos', header: 'Signos y síntomas descritos',  width: '120px', sort: true, },
    { field: 'comoTeSentisConRelacionAyer', header: 'Cómo te sentís en relación a ayer',  width: '120px', sort: true, },
    { field: 'sintomasEmpeoraron', header: 'Síntomas que empeoraron',  width: '120px', sort: true, },
    { field: 'sintomasMejoraron', header: 'Síntomas que mejoraron',  width: '120px', sort: true, },
    { field: 'congestionNasal', header: 'Congestión nasal', width: '120px', sort: true, },
    { field: 'secrecionNasal', header: 'Secreción nasal', width: '120px', sort: true, },
    { field: 'dolorGarganta', header: 'Dolor de garganta', width: '120px', sort: true, },
    { field: 'tos', header: 'Tos', width: '120px', sort: true, },
    { field: 'percibeOlores', header: 'Percibe olores', width: '120px', sort: true, },
    { field: 'desdeCuandoOlores', header: 'Desde cuándo no percibe olores', width: '120px', sort: true, },
    { field: 'percibeSabores', header: 'Percibe sabores', width: '120px', sort: true, },
    { field: 'desdeCuandoSabores', header: 'Desde cuándo no percibe sabores', width: '120px', sort: true, },
    { field: 'dificultadRespirar', header: 'Tiene dificultad para respirar', width: '120px', sort: true, },
    { field: 'sentisFiebre', header: 'Siente fiebre', width: '120px', sort: true, },
    { field: 'desdeCuandoFiebre', header: 'Desde cuándo siente fiebre', width: '120px', sort: true, },
    { field: 'tomasteTemperatura', header: 'Se tomó la temperatura', width: '120px', sort: true, },
    { field: 'temperatura', header: 'Temperatura', width: '120px', sort: true, },
    { field: 'fiebreAyer', header: 'Tuvo fiebre ayer', width: '120px', sort: true, },
    { field: 'sentisTristeDesanimado', header: 'Se siente triste/desanimado', width: '120px', sort: true, },
    { field: 'sentisAngustia', header: 'Siente angustia', width: '120px', sort: true, },
  ];

  constructor(
    private activeRoute: ActivatedRoute,
    private saludPacienteService: ReporteSaludPacienteService,
    private router: Router,
    private datepipe: DatePipe,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.cedula$ = this.activeRoute.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('cedula')),
      distinctUntilChanged(),
    );

    this.load$ = this.table.onLazyLoad.asObservable();

    this.start$ = this.load$.pipe(
      map(event => Number(event.first) / this.pageSize),
      startWith(0),
    );

    const httpCall$ = combineLatest(this.cedula$, this.load$).pipe(
      withLatestFrom(this.start$),
      switchMap(([[cedula, event], start]) => this.getHistorico(cedula, start, event.globalFilter, event.sortOrder === -1, event.sortField)),
      share(),
    );

    this.historico$ = httpCall$.pipe(
      map(paged => paged.list)
    );
    this.totalRecords$ = httpCall$.pipe(
      map(paged => paged.total),
      startWith(0)
    );

    // subscriptions
    this.onCsvDownload$.pipe(
      withLatestFrom(this.cedula$),
      switchMap(([_, cedula]) => this.downloadCsv(cedula)),
      withLatestFrom(this.cedula$),
      takeUntil(this.onDestroy$),
    ).subscribe(
      ([data, cedula]) => {
        let latest_date = this.datepipe.transform(new Date(), 'yyyyMMddHHmmss');
        saveAs(data,`HistoricoSalud${latest_date}_${cedula}.csv`);
      });

  }

  downloadCsv(cedula: string): Observable<Blob> {
    this.loading = true;
    let filterList = [`cedula:${cedula}`];
    return this.saludPacienteService.downloadCSV(null, this.table.sortField, this.table.sortOrder === -1, filterList)
      .pipe(
        finalize(() => this.loading = false)
      );
  }

  private getHistorico(cedula: string, page: number, filter: any, sortDesc: boolean, sortField: string): Observable<PagedList<ReporteSaludPaciente>> {
    let filterList = [`cedula:${cedula}`];
    this.loading = true;
    return this.saludPacienteService.getAll(page, this.pageSize, filter, sortField ? sortDesc : this.defaultOrderDesc, sortField || this.defaultOrder, filterList)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          if (err.status === 401) {
            this.router.navigate(['/']);
          }
          throw err;
        }),
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goBack() {
    this._location.back();
  }
}
