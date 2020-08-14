import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { MessageResponse } from '../model/message-response.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../shared/usuario.service';
import { SelectItem } from 'primeng/api';
import { RolService } from '../../rol/shared/rol.service';

@Component({
  selector: 'app-usuario-crear',
  templateUrl: './usuario-crear.component.html',
  styleUrls: ['./usuario-crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {

  constructor(private service: UsuarioService, private rolService: RolService) { }

  usuario: Usuario;

  formGroup: FormGroup;

  showOeeDialog: boolean;

  roles: SelectItem[] = [];

  @Input() visible: boolean;
  @Output() bindVisible: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() onResponse: EventEmitter<MessageResponse> = new EventEmitter<MessageResponse>(true);

  ngOnInit() {
    this.usuario = new Usuario();

    this.formGroup = new FormGroup({
      nombre: new FormControl('', [
        Validators.required
      ]),
      apellido: new FormControl('', [
        Validators.required
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      cedula: new FormControl('', [
        Validators.required
      ]),
      oee: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      cargo: new FormControl('', []),
      telefono: new FormControl('', []),
      rols: new FormControl([], [
        Validators.required
      ])
    });

    this.loadRoles();
  }

  crearUsuario() {
    this.usuario.nombre = this.formGroup.controls.nombre.value;
    this.usuario.apellido = this.formGroup.controls.apellido.value;
    this.usuario.username = this.formGroup.controls.username.value;
    this.usuario.cargo = this.formGroup.controls.cargo.value;
    this.usuario.telefono = this.formGroup.controls.telefono.value;
    this.usuario.rols = this.formGroup.controls.rols.value;
    this.usuario.cedula = this.formGroup.controls.cedula.value;

    this.service.createUser(this.usuario).subscribe(response => {

      if (response.status == 200 || response.status == 503) {
        this.onResponse.emit(response);
        this.close();
      } else {
        this.onResponse.emit(response);
      }
    });

  }

  searchOee() {
    this.showOeeDialog = true;
  }

  changeDialogOeeVisibility($event) {
    this.showOeeDialog = $event;
  }

  onSelectOee($event: any) {
    this.formGroup.controls.oee.setValue($event.descripcionOee);
  }

  close() {
    this.clear();
    this.bindVisible.emit(false);
  }

  clear() {
    this.formGroup.controls.nombre.setValue('');
    this.formGroup.controls.apellido.setValue('');
    this.formGroup.controls.username.setValue('');
    this.formGroup.controls.cedula.setValue('');
    this.formGroup.controls.oee.setValue('');
    this.formGroup.controls.cargo.setValue('');
    this.formGroup.controls.telefono.setValue('');
  }

  private loadRoles() {
    this.rolService.getAllActivo().subscribe(roles => {
      for (let i = 0; i < roles.length; i++) {
        let r = roles[i];
        this.roles[i] = { label: r.nombre, value: r };
      }
    });
  }

}
