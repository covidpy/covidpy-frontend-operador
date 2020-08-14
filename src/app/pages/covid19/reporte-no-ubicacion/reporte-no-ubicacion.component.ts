import {Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ReporteNoUbicacionModel} from "./model/reporte-no-ubicacion.model";
import {PermissionGuardService} from "../../../services/permission-guard.service";
import {saveAs} from 'file-saver';
import {ReporteNoUbicacionService} from "./shared/reporte-no-ubicacion.service";
import {DatePipe} from "@angular/common";
import {Subscription} from 'rxjs';
import {ReporteNoUbicacionSearch} from "./model/reporte-no-ubicacion.search";
import {OverlayPanel} from "primeng/primeng";
import {TipoPacienteService} from "./shared/tipo-paciente.service";
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Table} from 'primeng/table';

interface Catalogo {
  id: string;
  descripcion: string;
}


@Component({
  selector: 'app-reporte-no-ubicacion',
  templateUrl: './reporte-no-ubicacion.component.html',
  styleUrls: ['./reporte-no-ubicacion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteNoUbicacionComponent implements OnInit, OnDestroy {
  @ViewChild('op') _op: OverlayPanel;
  @ViewChild('table') table: Table;
  readonly PersonasSinReportarUbicacionTitle = 'Personas Sin Reportar Ubicación';
  readonly PersonasSinReportarEstadoSaludTitle = 'Personas Sin Reportar Estado De Salud';

  msgs: Message[] = [];
  block: boolean;
  cols: any[];
  pageSize: number = 10;
  start: number = 0;
  search: string;
  totalRecords: number = 0;
  sortDesc: boolean = true;
  sortField: string;
  reportes: ReporteNoUbicacionModel[];
  loading = true;
  error = false;
  private loadSubsciption: Subscription;
  tipoPacienteList: Catalogo[] = [];
  motivoIngresoList: Catalogo[] = [];
  filterList: string[] = [];
  advancedSearch: ReporteNoUbicacionSearch;
  title: string;
  tipoReporte: Catalogo[] = [];
  tipoReporteSelect: Catalogo;

  constructor(
    private _reporteService: ReporteNoUbicacionService,
    private permission: PermissionGuardService,
    private datepipe: DatePipe,
    private router: Router,
    private _tipoPaciente : TipoPacienteService,
              private _router: Router) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    this.tipoReporteSelect = {id:'ubicacion',descripcion:'No reportaron ubicación'};
    this.title =  this.PersonasSinReportarUbicacionTitle;
    this.getTipoPacienteList();
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '25%', sort: true, },
      { field: 'cedula', header: 'Cédula', width: '10%', sort: true, },
      { field: 'telefono', header: 'Teléfono', width: '15%', sort: true,  },
      { field: 'tipoIngreso', header: 'Motivo de Ingreso', width: '15%', sort: true, },
      { field: 'tipoPaciente', header: 'Tipo de Paciente', width: '15%', sort: true,  },
      { field: 'fechaUltimoReporte', header: 'Fecha Último Reporte', width: '25%', isDate: true, sort: true, fieldEntityUbicacion: 'fechaUltimoReporteUbicacion', fieldEntityEstadoSalud: 'fechaUltimoReporteEstadoSalud' },
      { field: 'horasRetraso', header: 'Horas de Retraso', width: '15%', sort: true, fieldEntityUbicacion: 'horasRetraso', fieldEntityEstadoSalud: 'horasRetrasoEstadoSalud' },
      { field: '', header: 'Acción', width: '18%', isAction: true }
    ];
    this.resetAdvancedSearch();
    this.motivoIngresoList = [
      {id:'ingreso_pais',descripcion:'Viajeros que llegaron al País'},
      {id:'aislamiento_confirmado',descripcion:'Casos confirmados de COVID-19'},
      {id:'aislamiento_contacto',descripcion:'Contactos de casos confirmados de COVID-19'},
      {id:'caso_sospechoso',descripcion:'Caso sospechoso de COVID-19'},
      {id:'examen_laboratorio',descripcion:'Examen de Laboratorio de COVID-19'}
    ];
    this.tipoReporte = [
      {id:'ubicacion',descripcion:'No reportaron ubicación'},
      {id:'estadosalud',descripcion:'No reportaron estado de salud'},
    ];
  }

  load($event: any) {

    if ($event) {
      this.start = this.search !== $event.globalFilter ? 0 : $event.first / this.pageSize;
      this.search = $event.globalFilter;
      this.pageSize = $event.rows;
      let field = this.cols.find(c => c.field === $event.sortField);
      this.sortField = (field ? this.tipoReporteSelect.id == 'ubicacion' ? field.fieldEntityUbicacion : field.fieldEntityEstadoSalud : field) || $event.sortField;
      this.sortDesc = $event.sortOrder == -1;
    }

    this.loadReporte();
  }

  onSearch() {
    this.filterList = [];
    this._op.visible = false;
    Object.keys(this.advancedSearch).forEach(property => {
      if(this.advancedSearch[property]){
        if(property === 'horaRetrasoMinimo' || property === 'horaRetrasoMaximo' ) {
          this.filterList.push(`${property}${this.tipoReporteSelect.id === 'estadosalud' ? 'EstadoSalud' : ''}:${this.advancedSearch[property]}`)
        }else{
          this.filterList.push(`${property}:${this.advancedSearch[property].id || this.advancedSearch[property]}`)
        }
      }
    });
    this.start = this.table.first = 0;
    this.loadReporte();
  }

  cancelSearch() {
    this.resetAdvancedSearch();
    this._op.visible = false;
  }

  resetAdvancedSearch() {
    this.advancedSearch = new ReporteNoUbicacionSearch();
  }

  private loadReporte() {
    if (this.loadSubsciption && !this.loadSubsciption.closed) {
      this.loadSubsciption.unsubscribe();
    }
    this.loading = true;
    this.error = false;
    this.loadSubsciption = this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.search, this.sortDesc, this.sortField,
      this.filterList, this.tipoReporteSelect.id)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(res => {
        if(res.status === 200) {
          this.reportes = res.body;
          this.totalRecords = res.headers.get('x-total-count');
        }
    }, (err) => {
        console.log(err);
    if (err.status === 401) {
        this.router.navigate(["/"]);
      } else {
        this.reportes = [];
        this.totalRecords = 0;
        this.error = true;
      }
    });
  }

  private getTipoPacienteList() {
    let filterDebeReportarUbicacion = [];
    filterDebeReportarUbicacion.push(this.tipoReporteSelect.id == 'ubicacion' ? `debeReportarUbicacion:true` : `debeReportarEstadoSalud:true`);

    this._tipoPaciente.getAll(null, filterDebeReportarUbicacion)
      .subscribe(res => {
        if(res.status === 200) {
          this.tipoPacienteList = res.body;
        }
      });
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

  onDownloadCsv() {
    this.loading = true;
    this._reporteService.downloadCSV(this.search, this.sortDesc, this.sortField, this.filterList, this.tipoReporteSelect.id).subscribe(
      (data: any) => {
        let latest_date = this.datepipe.transform(new Date(), 'yyyyMMddHHmmss');
        saveAs(data,`ListaPacientes${latest_date}.csv`);
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  navigateVerificarCedula(value) {
    this._router.navigate(['/covid19/operador/toma-muestra-laboratorial', value.cedula]);
  }

  onChangeTipoReporte(event) {
    this.resetAdvancedSearch();
    this.sortField = '';
    this.getTipoPacienteList();
    this.title = event.value.id == 'ubicacion' ? this.PersonasSinReportarUbicacionTitle : this.PersonasSinReportarEstadoSaludTitle;
    this.onSearch();
  }

}
