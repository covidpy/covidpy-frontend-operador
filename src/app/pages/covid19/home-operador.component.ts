import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';
import { StorageManagerService } from '../login/shared/storage-manager.service';
declare var $: any;

@Component({
  selector: "home-operador-selector",
  templateUrl: "./home-operador.component.html",
  providers: [Covid19Service]
})
export class HomeOperadorComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;

  // datos del formulario 
  public cedula: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;
  public tipoDocumentoOptions=[{value:0,label:'Cédula de Identidad'},{value:1,label:'Pasaporte'}];
  public tipoDocumento: any;
  public nombre: string;
  public apellido: string;
  public direccion: string;

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public qrCode: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private storageManager: StorageManagerService
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  openMessageDialog() {
    setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
  }

  keyPress(event: any) { 
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.telefValido = true;
    }else {
      this.telefValido = false;
    }
  }

  hasRol(rolName: string)
  {
    let credentials=this.storageManager.getLoginData();
    if(credentials)
    {
      for(let rol of credentials.usuario.rols)
      {
        if(rol.nombre==rolName)
        {
          return true;
        }
      }
      return false;
    }
    else
    {
      this._router.navigate(["/"]);
      return false;
    }
  }

}
