import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageManagerService } from '../login/shared/storage-manager.service';

declare var $: any;

@Component({
  selector: "operador-toma-muestra-laboratorial",
  templateUrl: "./operador-toma-muestra-laboratorial.component.html",
  providers: [Covid19Service]
})
export class OperadorTomaMuestraLaboratorial implements OnInit {

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

  public response: any;

  cedulaObtenida:string;

  showActualizarDiagnostico=false;
  resultadoUltimoDiagnosticoOptions=[{value:"positivo", label: "Caso Confirmado"},
                              {value:"negativo", label: "Examen Negativo"},
                              {value:"sospechoso", label: "Caso Sospechoso"},
                              {value:"alta_confirmado", label: "Alta de Caso Confirmado"},
                              {value:"alta_aislamiento", label: "Alta de Aislamiento"},
                              {value:"fallecido", label: "Fallecido"}
                             ];
  actualizarDiagnosticoFormGroup: FormGroup;

  es = {
    firstDayOfWeek: 0,
    dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
    dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
    dayNamesMin: [ "D","L","M","M","J","V","S" ],
    monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
    monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
    today: 'Hoy',
    clear: 'Borrar'
  };

  public localTomaMuestraOptions=[{value:'Costanera',label:'Costanera'},{value:'San Lorenzo',label:'San Lorenzo'},{value:'A definir',label:'A definir'}];
  //{value:null,label:'No examen laboratorial'},
  public tieneSintomasOptions=[{value:'Si',label:'Si'},{value:'No',label:'No'}];

  showCambiarNroCelular = false;
  msjCambiarNroCelular = '';
  nroCelularCambiar: string='';
  private cedulaParam: string;

  hoy: Date;
  showExamenLaboratorial: boolean = false;

  examenLaboratorialFormGroup: FormGroup;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storageManager: StorageManagerService,
    private _location: Location
  ) {
    this.loading = false;
    /*if (typeof localStorage !== "undefined") {
        localStorage.clear();
    }*/
  }

  ngOnInit() {
    this.actualizarDiagnosticoFormGroup = this.formBuilder.group({
      resultadoUltimoDiagnostico: [null,Validators.required],
      fechaUltimoDiagnostico: [null,Validators.required],
      fechaPrevistaFinAislamiento: [null],
      fechaPrevistaTomaMuestraLaboratorial: [null],
      localTomaMuestra:[null],
      tieneSintomas: [null],
      fechaInicioSintoma: [null],
      fechaExposicion: [null],
    });

    this.examenLaboratorialFormGroup = this.formBuilder.group({
      fechaPrevistaTomaMuestraLaboratorial: [null, Validators.required],
      localTomaMuestra:[null, Validators.required]
    });
    this._route.params.subscribe(params => {
      this.cedula = params["cedula"];
      if (this.cedula) {
        this.cedulaParam = this.cedula;
        this.obtenerPersona(this.cedula);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formSubmit(cedula) {
    if (this.cedulaParam !== cedula){
      this._router.navigate([this.cedulaParam ? '..': '.', cedula], {replaceUrl: true, relativeTo: this._route});
    } else {
      this.obtenerPersona(cedula);
    }
  }

  obtenerPersona(cedula): void {

    this.loading = true;
    this.cedula=null;
    this.codigoVerificacion=null;
    this.formDatosBasicos = null;
    this.service.getDatosPacienteByNumeroDocumento(cedula).subscribe(response => {
        this.loading = false;
        this.cedulaObtenida=cedula;
        this.response = response;
        this.mensaje= null;
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = "No se encontró una persona con este identificador";
        this.response = null;
      }
      //this.openMessageDialog();

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

  showPopupActualizarDiagnostico()
  {
    this.hoy = new Date();
    this.showActualizarDiagnostico=true;
    for(let resultadoUltimoDiagnostico of this.resultadoUltimoDiagnosticoOptions)
    {
      if(this.response.resultadoUltimoDiagnostico==resultadoUltimoDiagnostico.value)
      {
        this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.setValue(resultadoUltimoDiagnostico);
        break;
      }
    }
    this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.setValue(this.response.fechaUltimoDiagnostico);
    this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.setValue(this.response.fechaPrevistaFinAislamiento);

    this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.reset();
    this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.reset();

    this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.setValue(this.response.tieneSintomas);
    this.actualizarDiagnosticoFormGroup.controls.fechaInicioSintoma.setValue(this.response.fechaInicioSintoma);
    this.actualizarDiagnosticoFormGroup.controls.fechaExposicion.setValue(this.response.fechaExposicion);

  }

  actualizarDiagnostico(): void {
    this.loading = true;
    let diagnostico:any={};
    diagnostico.numeroDocumento=this.cedulaObtenida;
    diagnostico.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
    diagnostico.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
    diagnostico.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

    /*diagnostico.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
    if(this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value)
    {
      diagnostico.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value.value;
    }*/


    diagnostico.tieneSintomas = this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;
    diagnostico.fechaInicioSintoma = diagnostico.tieneSintomas == 'Si' ? this.actualizarDiagnosticoFormGroup.controls.fechaInicioSintoma.value : null;
    diagnostico.fechaExposicion =this.actualizarDiagnosticoFormGroup.controls.fechaExposicion.value;

    /*if((this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && !diagnostico.localTomaMuestra) ||
      (!this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && diagnostico.localTomaMuestra)){
        this.loading = false;
        this.mensaje = "Favor completar fecha prevista y local de toma de muestra.";
        this.openMessageDialog();
    }else{*/
      this.service.actualizarDiagnosticoPaciente(diagnostico).subscribe(response => {
          this.loading = false;
          this.mensaje= "Diagnóstico del Paciente registrado exitosamente.";
          this.showActualizarDiagnostico=false;
          this.response.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
          this.response.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
          this.response.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

          this.response.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
          if(this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value)
          {
            this.response.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value.value;
          }

          this.response.tieneSintomas=this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;
          this.response.fechaInicioSintoma = this.response.tieneSintomas == 'Si' ? this.actualizarDiagnosticoFormGroup.controls.fechaInicioSintoma.value : null;
          this.response.fechaExposicion = this.actualizarDiagnosticoFormGroup.controls.fechaExposicion.value;

          this.openMessageDialog();
      }, error => {
        if(error.status == 401)
        {
          this._router.navigate(["/"]);
        }
        else
        {
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
        }
      }
    );
  //}
  }

  closeActualizarDiagnostico()
  {
    this.showActualizarDiagnostico=false;
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

  goBack() {
    //this._location.back();
    this._router.navigate(["covid19/home-operador"]);
  }

  reenviarSms(){
    this.loading = true;
    this.service.reenviarSms(this.cedulaObtenida).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha enviado correctamente el SMS.";
      this.openMessageDialog();
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  showPopupCambiarNroCelular(){
    this.showCambiarNroCelular = true;
    if(this.response.numeroCelularVerificado==='verificado'){
      this.msjCambiarNroCelular = "El paciente ya se registró. No se enviará SMS de activación. El operador debe estar seguro de ingresar un número correcto.";
    }else{
      this.msjCambiarNroCelular = "El paciente no se registró aún. Se enviará SMS de activación.";
    }

  }

  closePopupCambiarNroCelular(){
    this.nroCelularCambiar = '';
    this.showCambiarNroCelular = false;
  }

  cambiarNroCelular(nroCelularCambiar){
      this.loading = true;
      let datosPaciente:any={};
      datosPaciente.numeroCelular = nroCelularCambiar;
      datosPaciente.numeroDocumento = this.cedulaObtenida;
      datosPaciente.numeroCelularVerificado = this.response.numeroCelularVerificado;
      this.service.cambiarNroCelular(datosPaciente).subscribe(response => {
        this.loading = false;
        this.mensaje = "Se ha cambiado correctamente el número de celular.";
        this.openMessageDialog();
      }, error => {
        if(error.status == 401)
        {
          this._router.navigate(["/"]);
        }
        else
        {
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
        }
      }
      );
  }

  irContactos(){
    console.log(this.response.id);
    this._router.navigate(["covid19/operador/contactos-paciente/", this.response.id, this.cedulaObtenida]);
  }

  showPopupExamenLaboratorial(){
    this.showExamenLaboratorial = true;
  }

  closePopupExamenLaboratorial(){
    this.showExamenLaboratorial = false;
  }

  nuevoExamenLaboratorial(): void {
    this.loading = true;
    let examenLaboratorial:any={};
    examenLaboratorial.numeroDocumento=this.cedulaObtenida;
    examenLaboratorial.fechaPrevistaTomaMuestraLaboratorial=this.examenLaboratorialFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
    examenLaboratorial.localTomaMuestra=this.examenLaboratorialFormGroup.controls.localTomaMuestra.value.value;

    this.service.crearExamenLaboratorial(examenLaboratorial).subscribe(response => {
      this.loading = false;
      this.mensaje= "Examen Laboratorial registrado exitosamente.";
      this.showExamenLaboratorial=false;
      this.response.fechaPrevistaTomaMuestraLaboratorial=this.examenLaboratorialFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
      if(this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value)
      {
        this.response.localTomaMuestra=this.examenLaboratorialFormGroup.controls.localTomaMuestra.value.value;
      }
      this.examenLaboratorialFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.setValue(null);
      this.examenLaboratorialFormGroup.controls.localTomaMuestra.setValue(null);
      this.openMessageDialog();
  }, error => {
    if(error.status == 401)
    {
      this._router.navigate(["/"]);
    }
    else
    {
      this.loading = false;
      this.mensaje = error.error;
      this.openMessageDialog();
    }
  }
);
  }

}
