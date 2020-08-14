import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

declare var $: any;

@Component({
  selector: "mostrar-datos-paciente-selector",
  templateUrl: "./mostrar-datos-paciente.component.html",
  providers: [Covid19Service]
})
export class MostrarDatosPacienteComponent implements OnInit {

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

  public codigoVerif: string;

  public localTomaMuestra:string;

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
    console.log("datos paciente");
    this.formDatosBasicos = new FormDatosBasicos();

    this.formDatosBasicos.tipoDocumento = +localStorage.getItem('tipoDocumento');
    if(this.formDatosBasicos.tipoDocumento==='0'){
      this.tipoDocumento = 'Cédula de Identidad';
    }else{
      this.tipoDocumento = 'Pasaporte';
    }
    this.formDatosBasicos.numeroDocumento = localStorage.getItem('numeroDocumento');
    this.formDatosBasicos.nombre = localStorage.getItem('nombre');
    this.formDatosBasicos.apellido = localStorage.getItem('apellido');
    this.formDatosBasicos.numeroCelular = localStorage.getItem('numeroCelular');
    this.formDatosBasicos.direccionDomicilio = localStorage.getItem('direccion');
    this.formDatosBasicos.correoElectronico = localStorage.getItem('email');
    this.codigoVerif = localStorage.getItem('codigo');

    this.formDatosBasicos.localTomaMuestra = localStorage.getItem('localTomaMuestra');

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  registrar(formDatosBasicos): void {
    this.loading = true;
        this.service.registrarPaciente(formDatosBasicos).subscribe(response => {
            console.log(response);
            if (response) {
              this.loading = false;
              this.mensaje = "Mensaje Enviado con Éxito";
              //this.openMessageDialog();
              this._router.navigate(["covid19/aislamiento/carga-codigo/"]);
            } else {
              this.loading = false;
              this.mensaje = "Fallo";
              this.openMessageDialog();

            }
          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo procesar la operación!";
            this.openMessageDialog();

          }
        );
  }

  avanzar(telefono: string): void {
    this.loading = true;
        this.service.sendMessage(telefono).subscribe(response => {
            if (response) {
              this.loading = false;
              this.mensaje = "Mensaje Enviado con Éxito";
              this.openMessageDialog();
            } else {
              this.loading = false;
              this.mensaje = "Fallo";
              this.openMessageDialog();

            }
          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo procesar la operación!";
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
