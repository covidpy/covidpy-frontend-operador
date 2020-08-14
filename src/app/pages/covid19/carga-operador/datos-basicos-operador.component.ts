import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { ReCaptchaV3Service } from 'ng-recaptcha';

declare var $: any;
@Component({
  selector: "datos-basicos-operador-selector",
  templateUrl: "./datos-basicos-operador.component.html",
  providers: [Covid19Service]
})
export class DatosBasicosOperadorComponent implements OnInit {

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

  //private subscription: Subscription;
  //public recentToken: string = ''
  //public recaptchaAvailable = false;

  public origen: string;
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];

  public departamentoOptions=[{value:'Capital',label:'Capital'},
                              {value:'Concepción',label:'Concepción'},{value:'San Pedro',label:'San Pedro'},
                              {value:'Cordillera',label:'Cordillera'},{value:'Guairá',label:'Guairá'},
                              {value:'Caaguazú',label:'Caaguazú'},{value:'Caazapá',label:'Caazapá'},
                              {value:'Itapúa',label:'Itapúa'},{value:'Misiones',label:'Misiones'},
                              {value:'Paraguarí',label:'Paraguarí'},{value:'Alto Paraná',label:'Alto Paraná'},
                              {value:'Central',label:'Central'},{value:'Ñeembucú',label:'Ñeembucú'},
                              {value:'Amambay',label:'Amambay'},{value:'Canindeyú',label:'Canindeyú'},
                              {value:'Presidente Hayes',label:'Presidente Hayes'},{value:'Alto Paraguay',label:'Alto Paraguay'},
                              {value:'Boquerón',label:'Boquerón'}];
  
  /*public departamentoOptions=[{value:0,label:'ASUNCIÓN'}, {value:1,label:'CONCEPCIÓN'},
                              {value:2,label:'SAN PEDRO'},
                              {value:3,label:'CORDILLERA'},{value:4,label:'GUAIRÁ'},
                              {value:5,label:'CAAGUAZÚ'},{value:6,label:'CAAZAPÁ'},
                              {value:7,label:'ITAPÚA'},{value:8,label:'MISIONES'},
                              {value:9,label:'PARAGUARÍ'},{value:10,label:'ALTO PARANÁ'},
                              {value:11,label:'CENTRAL'},{value:12,label:'ÑEEMBUCÚ'},
                              {value:13,label:'AMAMBAY'},{value:14,label:'CANINDEYÚ'},
                              {value:15,label:'PRESIDENTE HAYES'},{value:16,label:'ALTO PARAGUAY'},
                              {value:17,label:'BOQUERÓN'}];*/

  public ciudadOptions: any[];

  // recaptcha
  public recentToken: string = ''
  private subscription: Subscription;
  public recaptchaAvailable = false;

  public options: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    console.log("Registro hecho por operador");
    this.formDatosBasicos = new FormDatosBasicos();

    this.formDatosBasicos.tipoDocumento = 0;

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}"

    window.scrollTo(0, 0);

    //this.getRecaptchaToken('register');
    /*this._route.params.subscribe(params => {
        this.formDatosBasicos.tipoInicio = params["tipoInicio"];
    });*/
  }

  onChange(event){
    this.service.getCiudadesPorDepto(event.value).subscribe(ciudades => {
      console.log(ciudades);
      this.ciudadOptions = ciudades;
      
        for (let i = 0; i < ciudades.length; i++) {
          let c = ciudades[i];
          this.ciudadOptions[i] = { label: c.descripcion, value: c.idCiudad };
        }
      
        
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
        
    }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  registrar(formDatosBasicos): void {
    localStorage.setItem('tipoDocumento', formDatosBasicos.tipoDocumento);
    localStorage.setItem('numeroDocumento', formDatosBasicos.numeroDocumento);
    localStorage.setItem('nombre', formDatosBasicos.nombre);
    localStorage.setItem('apellido', formDatosBasicos.apellido);
    localStorage.setItem('numeroCelular', formDatosBasicos.numeroCelular);
    localStorage.setItem('direccion', formDatosBasicos.direccionDomicilio);
    localStorage.setItem('email', formDatosBasicos.correoElectronico);

    /*if(this.recaptchaAvailable){
      this.formDatosBasicos.rcToken = this.recentToken;
    }*/
    
      this.loading = true;
      this.service.guardarDatosBasicosOperador(formDatosBasicos).subscribe(response => {
          console.log(response);
          this.loading = false;
          this.mensaje = "Mensaje Enviado con Éxito";

          //localStorage.setItem('idRegistro', response);
          this.idRegistro = +response;

          this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
          //this._router.navigate(["covid19/aislamiento/datos-paciente/"]);           
            
        }, error => {
          console.log(error);
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
            
        }
      );
  }

  getRecaptchaToken(action){
    this.subscription = this.recaptchaV3Service.execute(action)
        .subscribe(response => {
            this.recentToken = response;
            this.recaptchaAvailable = true;
        },error=>{
          console.log("error getting recaptcha");
          this.ngOnDestroy()

        });
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
