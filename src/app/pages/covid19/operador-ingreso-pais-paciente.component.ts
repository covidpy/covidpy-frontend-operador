import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

declare var $: any;

@Component({
  selector: "operador-ingreso-pais-paciente",
  templateUrl: "./operador-ingreso-pais-paciente.component.html",
  providers: [Covid19Service]
})
export class OperadorIngresoPaisPaciente implements OnInit {

  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosBasicos: FormDatosBasicos;

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
  public codigo: string;

  // recaptcha
  // public captchaResponse: string;
  // public captcha: any;
  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public origen: string;

  public idRegistro: number;
  public codigoVerif: string;

  public contrasenha: string;
  public contrasenhaConfirm: string;

  public codigoVerificacion: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute
  ) {
    this.loading = false;
    /*if (typeof localStorage !== "undefined") {
        localStorage.clear();
    }*/
  }

  ngOnInit() {  

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  obtenerPersona(cedula, codigoVerificacion): void {
    
    this.loading = true;
    this.cedula=null;
    this.codigoVerificacion=null;
    this.formDatosBasicos = null;
    this.service.getDatosBasicosByNumeroDocumentoAndCodigoVerificacion(cedula, codigoVerificacion).subscribe(response => {
        this.loading = false;
        this.cedula=cedula;
        this.codigoVerificacion=codigoVerificacion;
        this.formDatosBasicos = response;
    }, error => {
      this.loading = false;
      this.mensaje = "No se encontró a la persona";
      this.openMessageDialog();
      
    }
  );
  }

  confirmarPaciente(): void {
    
    this.loading = true;
    this.service.confirmarPersona(this.cedula, this.codigoVerificacion).subscribe(response => {        
            this.loading = false;
            this.mensaje = "Persona Confirmada con Éxito";
            this.openMessageDialog();
          }, error => {
            this.loading = false;
            this.mensaje = error.error;
            this.openMessageDialog();
            
          }
    );
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

}
