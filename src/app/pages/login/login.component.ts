import { Component, OnInit } from '@angular/core';
import { UsernamePassword } from './model/username-password.model';
import { Message, MessageService } from 'primeng/api';
import { LoginService } from './shared/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageManagerService } from './shared/storage-manager.service';
import { PermissionGuardService } from '../../services/permission-guard.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']/*,
  providers: [LoginService, PermissionGuardService, StorageManagerService]*/
})
export class LoginComponent implements OnInit {

  up: UsernamePassword = new UsernamePassword();

  msgs: Message[] = []

  constructor(private service: LoginService, private router: Router, private storageManager: StorageManagerService, private routeState: ActivatedRoute, private permissionService: PermissionGuardService) { }

  ngOnInit() {
    if (this.routeState.queryParams) {
      this.routeState.queryParams.subscribe(params => {
        let status = params['status'];

        let message = params['message'];

        if (status == 200) {
          this.msgs = [];
          this.msgs.push({ severity: 'success', detail: message });
        }
      });
    }
  }

  doLogin() {
    this.service.doLogin(this.up).subscribe(response => {
      if (response.token) {
        this.storageManager.saveSessionData(response);
        let session = this.storageManager.getLoginData();
        /*if(this.checkRol("Administrador del Portal") || this.checkRol("Administrador institucional OEE")){
          this.router.navigate(['/servicios']);
        } else if(this.checkRol("Administrador de Sistemas")) {
          this.router.navigate(['/sistemas']);
        } else if(this.checkRol("Administrador de Carpeta Ciudadana")) {
          this.router.navigate(['/documentos']);
        } else {*/
          //this.router.navigate(['/covid19/aislamiento/registro-paciente']);
          this.router.navigate(['/covid19/home-operador']);
        //}
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Login o Clave Inválida' });
      }

    });
  }

  checkRol(nombre: string): boolean {
    //return null;
    return this.permissionService.hasRol(nombre);
  }

}
