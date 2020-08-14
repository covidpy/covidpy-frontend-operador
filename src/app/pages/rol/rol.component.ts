import { Component, OnInit, OnDestroy } from '@angular/core';
import { Rol } from './model/rol.model';
import { Message, ConfirmationService } from 'primeng/api';
import { RolService } from './shared/rol.service';
import { delay } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageResponse } from './model/message-response.model';
import { PermissionGuardService } from '../../services/permission-guard.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
  providers: [ConfirmationService]
})
export class RolComponent implements OnInit, OnDestroy {

  msgs: Message[] = [];

  block: boolean;

  cols: any[];

  pageSize: number = 10;

  start: number = 0;

  filter: string;

  totalRecords: number = 0;

  sortAsc: boolean = true;

  sortField: string;

  roles: Rol[];

  rol: Rol;

  showRolCreateDialog: boolean;

  formGroup: FormGroup;

  constructor(private service: RolService, private confirmationService: ConfirmationService, private permission: PermissionGuardService) { }

  ngOnInit() {
    this.rol = new Rol();

    this.service.connect().pipe(delay(0)).subscribe(l => {
      this.block = l;
    });

    this.cols = [
      { field: 'nombre', header: 'Nombre', width: '12%' },
      { field: 'descripcion', header: 'Descripción', width: '12%' },
      { field: 'activo', header: 'Está activo?', width: '7%' },
      { field: '', header: 'Acción', width: '10%' }
    ];
  }

  ngOnDestroy() {
    this.service.disconnet();
  }

  load($event: any) {

    if ($event) {
      this.filter = $event.globalFilter;
      this.start = $event.first;
      this.pageSize = $event.rows;
      this.sortField = $event.sortField;

      if ($event.sortOrder == 1)
        this.sortAsc = true;
      else
        this.sortAsc = false;
    }

    this.loadRoles();
  }


  private loadRoles() {
    this.service.getAllQueryRol(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(roles => {
      this.roles = roles.lista;
      this.totalRecords = roles.totalRecords;
    });
  }

  onRowEditInit(rowData: Rol) {

    this.rol = rowData;

    this.formGroup = new FormGroup({
      nombre: new FormControl(rowData.nombre, [
        Validators.required
      ]),
      descripcion: new FormControl(rowData.descripcion, [
        Validators.required
      ]),
      activo: new FormControl(rowData.activo, []),
    });

  }

  onRowEditSave(data: Rol) {

    this.rol.nombre = this.formGroup.controls.nombre.value;
    this.rol.descripcion = this.formGroup.controls.descripcion.value;
    this.rol.activo = this.formGroup.controls.activo.value;

    this.service.updateRol(this.rol).subscribe(response => {
      if (response.status == 200) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: response.message });
      } else {
        if (response.status < 500) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: 'Atención', detail: response.message });
        } else {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error al procesar la operación' });
        }
      }
      this.loadRoles();
    });
    setTimeout(() => { this.msgs = []; }, 2000);
  }

  onRowEditCancel(data: Rol) {
    this.loadRoles();
  }

  createRol() {
    this.showRolCreateDialog = true;
  }

  onRolCreateResponse(res: MessageResponse) {
    if (res.status == 200) {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: res.message });
      this.loadRoles();
    } else {
      if (res.status < 500) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Atención', detail: res.message });
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error al procesar la operación' });
      }
    }
    setTimeout(() => { this.msgs = []; }, 2000);
  }

  changeDialogRolCreateVisibility($event) {
    this.showRolCreateDialog = $event;
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

}
