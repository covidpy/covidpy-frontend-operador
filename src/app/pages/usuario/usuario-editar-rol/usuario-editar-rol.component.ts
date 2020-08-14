import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MessageResponse } from '../model/message-response.model';
import { Usuario } from '../model/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RolService } from '../../rol/shared/rol.service';
import { UsuarioService } from '../shared/usuario.service';

@Component({
  selector: 'usuario-editar-rol',
  templateUrl: './usuario-editar-rol.component.html',
  styleUrls: ['./usuario-editar-rol.component.css']
})
export class UsuarioEditarRolComponent implements OnInit {

  roles: SelectItem[] = [];

  @Input() visible: boolean;
  @Input() data: Usuario;
  @Output() bindVisible: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() onResponse: EventEmitter<MessageResponse> = new EventEmitter<MessageResponse>(true);

  formGroup: FormGroup;

  constructor(private service: RolService, private userService: UsuarioService) { }

  ngOnInit() {

    this.formGroup = new FormGroup({
      rols: new FormControl([], [
        Validators.required
      ])
    });

  }

  updateRols() {
    this.data.rols = this.formGroup.controls.rols.value;

    this.userService.updateRols(this.data).subscribe(response => {
      this.onResponse.emit(response);
      this.close();
    });
    
  }

  onShow() {
    this.service.getAllActivo().subscribe(roles => {
      for (let i = 0; i < roles.length; i++) {
        let r = roles[i];
        this.roles[i] = { label: r.nombre, value: r };
      }
    });

    if (this.data) {
      this.service.getAllByUser(this.data.id).subscribe(rols => {
        if (rols.length != 0)
          this.formGroup.controls.rols.setValue(rols);
      });
    }
  }


  close() {
    this.formGroup.controls.rols.setValue([]);
    this.bindVisible.emit(false);
  }

}
