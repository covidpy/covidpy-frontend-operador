import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernamePassword } from '../model/username-password.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../usuario/shared/usuario.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {

  formGroup: FormGroup;

  passwords: UsernamePassword;
  token: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private service: UsuarioService) { }

  ngOnInit() {

    this.passwords = new UsernamePassword();

    if (this.activatedRoute.paramMap) {
      this.activatedRoute.paramMap.subscribe(params => {
        this.token = params.get('token');
      });
    } else {
      this.router.navigate(['/login']);
    }

    this.passwords = new UsernamePassword();

    this.formGroup = new FormGroup({

      password: new FormControl('', [
        Validators.required
      ]),
      password2: new FormControl('', [
        Validators.required
      ])
    });
  }

  cambiarClave() {
    this.passwords.password = this.formGroup.controls.password.value;
    this.passwords.password2 = this.formGroup.controls.password2.value;
    
    this.service.changePassword(this.token, this.passwords).subscribe(res => {
      this.router.navigate(["/login"], { queryParams: { status: res.status, message: res.message } });
    });

  }

}
