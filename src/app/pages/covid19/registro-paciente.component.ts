import { Component, OnInit, SecurityContext } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';
import {FormDatosBasicos} from './model/formDatosBasicos.model';
import { DomSanitizer } from "@angular/platform-browser";
import {calendarEsLocale} from '../../util/calendar-es-locale';

declare var $: any;
@Component({
  selector: "registro-paciente-selector",
  templateUrl: "./registro-paciente.component.html",
  providers: [Covid19Service]
})
export class RegistroPacienteComponent implements OnInit {

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

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public origen: string;

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Viajeros que llegaron al País'}
    ,{value:'aislamiento_confirmado',label:'Casos confirmados de COVID-19'}
    ,{value:'aislamiento_contacto',label:'Contactos de casos confirmados de COVID-19'}
    ,{value:'caso_sospechoso',label:'Caso sospechoso de COVID-19'}
    ,{value:'examen_laboratorio',label:'Examen de Laboratorio de COVID-19'}
  ];

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

  public ciudadOptions: any[];

  public localTomaMuestraOptions=[{value:'Costanera',label:'Costanera'},{value:'San Lorenzo',label:'San Lorenzo'},{value:'A definir',label:'A definir'}];

  public localTomaMuestra:string;

  es = calendarEsLocale;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    this.formDatosBasicos = new FormDatosBasicos();

    this.formDatosBasicos.tipoDocumento = 0;

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
    /*if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.nombre)!=formDatosBasicos.nombre)
    {
      this.mensaje = "Se detectaron carácteres especiales en el nombre.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.nombre);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en el nombre.";
      this.openMessageDialog();
      return;
    }


    if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.apellido)!=formDatosBasicos.apellido)
    {
      this.mensaje = "Se detectaron carácteres especiales en el apellido.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.apellido);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en el apellido.";
      this.openMessageDialog();
      return;
    }

    if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.numeroDocumento)!=formDatosBasicos.numeroDocumento)
    {
      this.mensaje = "Se detectaron carácteres especiales en el numero de documento.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.numeroDocumento);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en el numero de documento.";
      this.openMessageDialog();
      return;
    }

    if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.numeroCelular)!=formDatosBasicos.numeroCelular)
    {
      this.mensaje = "Se detectaron carácteres especiales en el numero de celular.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.numeroCelular);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en el numero de celular.";
      this.openMessageDialog();
      return;
    }

    if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.direccionDomicilio)!=formDatosBasicos.direccionDomicilio)
    {
      this.mensaje = "Se detectaron carácteres especiales en la dirección.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.direccionDomicilio);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en la dirección.";
      this.openMessageDialog();
      return;
    }

    if(this.domSanitizer.sanitize(SecurityContext.HTML,formDatosBasicos.ciudadDomicilio)!=formDatosBasicos.ciudadDomicilio)
    {
      this.mensaje = "Se detectaron carácteres especiales en la ciudad.";
      this.openMessageDialog();
      return;
    }
    try{
      this.domSanitizer.sanitize(SecurityContext.SCRIPT,formDatosBasicos.ciudadDomicilio);
    }
    catch(e)
    {
      this.mensaje = "Se detectaron carácteres especiales en la ciudad.";
      this.openMessageDialog();
      return;
    }*/

    if(formDatosBasicos.numeroDocumento.includes('.'))
    {
      this.mensaje = 'La cédula no debe poseer puntos.';
      this.openMessageDialog();
      return;
    }
    formDatosBasicos.numeroDocumento=formDatosBasicos.numeroDocumento.trim();

    localStorage.setItem('tipoDocumento', formDatosBasicos.tipoDocumento);
    localStorage.setItem('numeroDocumento', formDatosBasicos.numeroDocumento);
    localStorage.setItem('nombre', formDatosBasicos.nombre);
    localStorage.setItem('apellido', formDatosBasicos.apellido);
    localStorage.setItem('numeroCelular', formDatosBasicos.numeroCelular);
    localStorage.setItem('direccion', formDatosBasicos.direccionDomicilio);
    localStorage.setItem('email', formDatosBasicos.correoElectronico);

    localStorage.setItem('localTomaMuestra', formDatosBasicos.localTomaMuestra);

      this.loading = true;
      this.service.registrarPaciente(formDatosBasicos).subscribe(response => {
            console.log(response);
            if (response) {
              this.loading = false;
              this.mensaje = "Mensaje Enviado con Éxito";
              localStorage.setItem('codigo', response);
              this._router.navigate(["covid19/aislamiento/datos-paciente/"]);
              //this._router.navigate(["covid19/home-operador/"]);
            } else {
              this.loading = false;
              this.mensaje = "Fallo";
              this.openMessageDialog();

            }
          }, error => {
            if(error.status == 401)
            {
              this._router.navigate(["/"]);
            }
            else if(error.status == 400)
            {
              this.loading = false;
              this.mensaje = error.error;
              this.openMessageDialog();
            }
            else
            {
              this.loading = false;
              //this.mensaje = error.error;
              this.mensaje = "No se pudo registrar el paciente. Favor volver a intentarlo.";
              this.openMessageDialog();
            }
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

  consultarIdentificaciones(formDatosBasicos: FormDatosBasicos) {
    if(formDatosBasicos.tipoDocumento==0&&formDatosBasicos.numeroDocumento)
    {
      if(formDatosBasicos.numeroDocumento.includes('.'))
      {
        this.mensaje = 'La cédula no debe poseer puntos.';
        this.openMessageDialog();
      }
      else
      {
        this.loading = true;
        formDatosBasicos.numeroDocumento=formDatosBasicos.numeroDocumento.trim();
        this.service.getIdentificacionesByNumeroDocumento(formDatosBasicos.numeroDocumento).subscribe(response => {
            this.loading = false;
            if(response.obtenerPersonaPorNroCedulaResponse.return.error)
            {
              this.mensaje = response.obtenerPersonaPorNroCedulaResponse.return.error;
              this.openMessageDialog();
            }
            else
            {
              formDatosBasicos.nombre=response.obtenerPersonaPorNroCedulaResponse.return.nombres;
              formDatosBasicos.apellido=response.obtenerPersonaPorNroCedulaResponse.return.apellido;
              formDatosBasicos.fechaNacimiento=response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10)+'/'+
                                                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+
                                                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4);
            }
        }, error => {
          if(error.status == 401)
          {
            this._router.navigate(["/"]);
          }
          else
          {
            this.loading = false;
            //this.mensaje = error.error;
            this.mensaje = "No se pudieron obtener los datos del paciente.";
            this.openMessageDialog();
          }
        }
    );
      }
    }
  }

}
