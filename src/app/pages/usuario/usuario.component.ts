import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from './model/usuario.model';
import { Message, ConfirmationService } from 'primeng/api';
import { UsuarioService } from './shared/usuario.service';
import { delay } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageResponse } from './model/message-response.model';
import { PermissionGuardService } from '../../services/permission-guard.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ConfirmationService]
})
export class UsuarioComponent implements OnInit, OnDestroy {

  msgs: Message[] = [];

  block: boolean;

  cols: any[];


  pageSize: number = 10;

  start: number = 0;

  filter: string;

  totalRecords: number = 0;

  sortAsc: boolean = true;

  sortField: string;

  usuarios: Usuario[];

  usuario: Usuario;

  showOeeDialog: boolean;

  showUserCreateDialog: boolean;

  showEditRolDialog: boolean;

  formGroup: FormGroup;

  constructor(private service: UsuarioService, private confirmationService: ConfirmationService, private permission: PermissionGuardService) { }

  ngOnInit() {
    this.showEditRolDialog = false;

    this.usuario = new Usuario();

    this.cols = [
      { field: 'nombre', header: 'Nombre', width: '12%' },
      { field: 'apellido', header: 'Apellido', width: '12%' },
      { field: 'cedula', header: 'Cédula', width: '8%' },
      { field: 'username', header: 'Nombre de usuario', width: '22%' },
      { field: 'oee.descripcionOee', header: 'Institucion', width: '30%' },
      { field: 'activo', header: 'Activo', width: '7%' },
      { field: '', header: 'Acción', width: '15%' }
    ];
  }

  ngOnDestroy() {
    
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

    this.loadUsers();
  }


  private loadUsers() {
    this.service.getAllQueryUsuario(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(usuarios => {
      this.usuarios = usuarios.lista;
      this.totalRecords = usuarios.totalRecords;
    });
  }

  onRowEditInit(rowData: Usuario) {

    this.usuario = rowData;

    this.formGroup = new FormGroup({
      nombre: new FormControl(rowData.nombre, [
        Validators.required
      ]),
      apellido: new FormControl(rowData.apellido, [
        Validators.required
      ]),
      cedula: new FormControl(rowData.cedula, [
        Validators.required
      ]),
      username: new FormControl(rowData.username, [
        Validators.required,
        Validators.email
      ]),
      activo: new FormControl(rowData.activo, []),
    });

  }

  onRowEditSave(data: Usuario) {

    this.usuario.nombre = this.formGroup.controls.nombre.value;
    this.usuario.apellido = this.formGroup.controls.apellido.value;
    this.usuario.username = this.formGroup.controls.username.value;
    this.usuario.activo = this.formGroup.controls.activo.value;

    this.service.updateUser(this.usuario).subscribe(response => {
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
      this.loadUsers();
    });
  }

  onRowEditCancel(data: Usuario) {
    this.loadUsers();
  }

  cambiarClave(dataRow: Usuario) {

    this.confirmationService.confirm({
      message: '¿Estás seguro de realizar esta acción?',
      header: 'Enviar correo para cambio de contraseña',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.service.sendPasswordEmail(dataRow).subscribe(response => {
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
        });
      }
    });

  }

  searchOee() {
    this.showOeeDialog = true;
  }

  createUser() {
    this.showUserCreateDialog = true;
  }

  editRols(user: Usuario) {
    this.usuario = user;
    this.showEditRolDialog = true;
  }

  onUserCreateResponse(res: MessageResponse) {
    if (res.status == 200) {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: res.message });
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


  onUserEditRolResponse(res: MessageResponse) {
    if (res.status == 200) {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: res.message });
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

  onSelectOee(rowData: Usuario, $event: any) {
    this.formGroup.controls.oee.setValue($event.descripcionOee);
  }

  changeDialogOeeVisibility($event) {
    this.showOeeDialog = $event;
  }

  changeDialogUserCreateVisibility($event) {
    this.showUserCreateDialog = $event;
  }

  changeDialogUserEditRolsVisibility($event) {
    this.showEditRolDialog = $event;
  }


  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

}
