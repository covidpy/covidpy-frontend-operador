import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessageResponse } from '../model/message-response.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { RolService } from '../shared/rol.service';
import { Rol } from '../model/rol.model';

@Component({
  selector: 'app-rol-crear',
  templateUrl: './rol-crear.component.html',
  styleUrls: ['./rol-crear.component.css']
})
export class RolCrearComponent implements OnInit {

  constructor(private service: RolService) { }

  rol: Rol;

  formGroup: FormGroup;

  @Input() visible: boolean;
  @Output() bindVisible: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() onResponse: EventEmitter<MessageResponse> = new EventEmitter<MessageResponse>(true);

  ngOnInit() {
    this.rol = new Rol();

    this.formGroup = new FormGroup({
      nombre: new FormControl('', [
        Validators.required
      ]),
      descripcion: new FormControl('', [
        Validators.required
      ])
    });
  }

  crearRol() {
    this.rol.nombre = this.formGroup.controls.nombre.value;
    this.rol.descripcion = this.formGroup.controls.descripcion.value;

    this.service.createRol(this.rol).subscribe(response => {
      if (response.status == 200 || response.status == 503) {
          this.onResponse.emit(response);
          this.close();
      } else {
        this.onResponse.emit(response);
      }
    });

  }

  close() {
    this.clear();
    this.bindVisible.emit(false);
  }

  clear() {
    this.formGroup.controls.nombre.setValue('');
    this.formGroup.controls.descripcion.setValue('');
  }
}
