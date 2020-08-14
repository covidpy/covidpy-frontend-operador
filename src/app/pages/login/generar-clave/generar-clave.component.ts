import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../usuario/model/usuario.model';
import { UsuarioService } from '../../usuario/shared/usuario.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-generar-clave',
  templateUrl: './generar-clave.component.html',
  styleUrls: ['./generar-clave.component.css']
})
export class GenerarClaveComponent implements OnInit {

  user: Usuario;

  formGroup: FormGroup;

  constructor(private service: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.formGroup = new FormGroup({

      username: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });
    this.user = new Usuario();
  }


  enviarCorreo() {
    this.user.username = this.formGroup.controls.username.value;

    this.service.sendPasswordEmail(this.user).subscribe(res => {
      this.router.navigate(["/login"], { queryParams: { status: res.status, message:res.message } });
    })
  }



}
