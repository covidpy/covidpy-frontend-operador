import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

declare var $: any;

@Component({
  selector: "mostrar-datos-al-paciente-selector",
  templateUrl: "./mostrar-datos-al-paciente.component.html",
  providers: [Covid19Service]
})
export class MostrarDatosAlPacienteComponent implements OnInit {

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
  public declaracionAgreement:boolean;

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
    console.log("mostrar datos al paciente");
    this._route.params.subscribe(params => {
      this.idRegistro = params["idRegistro"];
      this.codigoVerif = params["codigoVerif"];
    });
    
    this.service.getDatosBasicos(this.idRegistro, this.codigoVerif).subscribe(response => {
      console.log(response);
      if (response) {
        this.loading = false;
        this.mensaje = "Mensaje Enviado con Éxito";

        this.formDatosBasicos = new FormDatosBasicos();     
        this.formDatosBasicos = response;

        if(this.formDatosBasicos.tipoDocumento==='0'){
          this.tipoDocumento = 'Cédula de Identidad';
        }else{
          this.tipoDocumento = 'Pasaporte';
        }

        //this._router.navigate(["covid19/carga-codigo/"]);
      } else {
        this.loading = false;
        this.mensaje = "No se pudieron obtener los datos básicos";
        this.openMessageDialog();

      }
    }, error => {
      this.loading = false;
      this.mensaje = "No se pudo procesar la operación!";
      this.openMessageDialog();
      
    }
  );

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  validarTelefono(contrasenha): void {

    if(!this.verificarClave(contrasenha)){
      this.mensaje = "Su clave de seguridad es insegura. Le recomendamos cambiar por una clave de seguridad con letras y números.";
      //this.formDatosBasicos.contrasenha = null;
      //this.formDatosBasicos.contrasenhaConfirm = null;
      this.openMessageDialog();
    }else{
      this.loading = true;
      this.service.validarTelefono(this.idRegistro, this.codigoVerif, contrasenha).subscribe(response => {
            console.log(response);
            
            this.loading = false;
            this.mensaje = "Mensaje Enviado con Éxito";
            this._router.navigate(["covid19/aislamiento/datos-clinicos/",this.idRegistro, this.codigoVerif]);

          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo validar el teléfono!";
            this.openMessageDialog();
            
          }
      );
    }
  }

  verificarClave(contrasenha){
    if(contrasenha==="12345678" || contrasenha==="123456789" || contrasenha==="87654321" || contrasenha==="987654321"
      || contrasenha==="abcdefgh" || contrasenha==="qwertyui" || contrasenha==="asdfghjk"){
        return false;
    }else{
      return true;
    }
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
