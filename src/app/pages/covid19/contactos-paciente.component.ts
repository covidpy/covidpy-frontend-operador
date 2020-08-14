import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageManagerService } from '../login/shared/storage-manager.service';
import { CensoContacto } from "./model/censoContacto.model";
import { Paciente } from "./model/paciente.model";

declare var $: any;

@Component({
  selector: "contactos-paciente",
  templateUrl: "./contactos-paciente.component.html",
  providers: [Covid19Service]
})
export class ContactosPaciente implements OnInit {

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

  public tieneSintomasOptions=[{value:'Si',label:'Si'},{value:'No',label:'No'}];

  showCambiarNroCelular = false;
  msjCambiarNroCelular = '';
  nroCelularCambiar: string='';

  cols: any[];
  contactosList: any[];
  pageSize: number = 10;
  start: number = 0;
  filter: string;
  totalRecords: number = 0;
  sortAsc: boolean = true;
  sortField: string;

  idPaciente: number;
  showBorrarContacto: boolean = false;
  idContacto: number;
  showAgregarContacto: boolean = false;
  agregarContactoFormGroup: FormGroup;

  showEditarContacto: boolean = false;
  public cedulaPaciente: string;

  hoy: Date;

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
      localTomaMuestra:[''],
      tieneSintomas: [null],
    });

    this.agregarContactoFormGroup = this.formBuilder.group({
      nroDocumento: [null,Validators.required],
      nombres: [null,Validators.required],
      apellidos: [null,Validators.required],
      telefono: [null,Validators.required],
      domicilio: [null,Validators.required],
      fechaUltimoContacto: [null,Validators.required],
      paciente: [null],
      tipo: [null,Validators.required],
    });

    this._route.params.subscribe(params => {
      this.idPaciente = params["id"];
      this.cedulaPaciente = params["cedula"];
      console.log(this.idPaciente+" "+this.cedulaPaciente);
    });

    this.cols = [{ field: 'nroDocumento', header: 'Nro de Documento', width: '9%' },
        { field: 'nombres', header: 'Nombres', width: '15%' },
        { field: 'apellidos', header: 'Apellidos', width: '15%' },
        { field: 'telefono', header: 'Teléfono', width: '11%' },
        { field: 'domicilio', header: 'Domicilio', width: '17%' },
        { field: 'tipo', header: 'Tipo', width: '9%' },
        { field: 'fechaUltimoContacto', header: 'Último Contacto', width: '15%' },
        { field: '', header: 'Acciones', width: '9%' }];
  }

  load($event: any) {
    if ($event) {
      this.filter = $event.globalFilter;
      this.start = $event.first;
      this.pageSize = $event.rows;
      this.sortField = $event.sortField;

      if ($event.sortOrder == 1)
        this.sortAsc = true;
      else
        this.sortAsc = false;
    }
    this.buscarContactos();
    
}

buscarContactos(){
  this.service.getContactosPaciente(this.idPaciente, this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(contactos => {
    this.contactosList = contactos.lista;
    this.totalRecords = contactos.totalRecords;

    console.log(this.contactosList);   
  });
}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
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

  actualizarDiagnostico(): void {
    this.loading = true;
    let diagnostico:any={};
    diagnostico.numeroDocumento=this.cedulaObtenida;
    diagnostico.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
    diagnostico.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
    diagnostico.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

    diagnostico.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
    diagnostico.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value;

    diagnostico.tieneSintomas = this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;

    if((this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && !diagnostico.localTomaMuestra) || 
      (!this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && diagnostico.localTomaMuestra)){
        this.loading = false;
        this.mensaje = "Favor completar fecha prevista y local de toma de muestra.";
        this.openMessageDialog();
    }else{
      this.service.actualizarDiagnosticoPaciente(diagnostico).subscribe(response => {
          this.loading = false;
          this.mensaje= "Diagnóstico del Paciente registrado exitosamente.";
          this.showActualizarDiagnostico=false;
          this.response.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
          this.response.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
          this.response.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

          this.response.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
          this.response.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value;

          this.response.tieneSintomas=this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;

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

  volver() {
    //this._location.back();
    this._router.navigate(["covid19/operador/toma-muestra-laboratorial/", this.cedulaPaciente]);
  }

  mostrarEditarContacto(contacto){
    this.showEditarContacto = true;
    this.idContacto = contacto.id;
    this.hoy = new Date();

    this.agregarContactoFormGroup.controls.nroDocumento.setValue(contacto.nroDocumento);
    this.agregarContactoFormGroup.controls.nombres.setValue(contacto.nombres);
    this.agregarContactoFormGroup.controls.apellidos.setValue(contacto.apellidos);
    this.agregarContactoFormGroup.controls.telefono.setValue(contacto.telefono);
    this.agregarContactoFormGroup.controls.domicilio.setValue(contacto.domicilio);
    console.log(contacto.fechaUltimoContacto);
    let dateParts = contacto.fechaUltimoContacto.split("-");
    let fechaContactoString = dateParts[2]+"/"+dateParts[1]+"/"+dateParts[0]
    console.log(fechaContactoString);
    this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(fechaContactoString);
    this.agregarContactoFormGroup.controls.tipo.setValue(contacto.tipo);
  }

  closeEditarContacto(){
    this.showEditarContacto = false;
  }

  editarContacto(){
    this.loading = true;
    let contacto = new CensoContacto();
    let paciente = new Paciente();
    contacto.id = this.idContacto;
    contacto.nroDocumento = this.agregarContactoFormGroup.controls.nroDocumento.value;
    contacto.nombres = this.agregarContactoFormGroup.controls.nombres.value;
    contacto.apellidos = this.agregarContactoFormGroup.controls.apellidos.value;
    contacto.telefono = this.agregarContactoFormGroup.controls.telefono.value;
    contacto.domicilio = this.agregarContactoFormGroup.controls.domicilio.value;
    contacto.tipo = this.agregarContactoFormGroup.controls.tipo.value;

    let dateParts = this.agregarContactoFormGroup.controls.fechaUltimoContacto.value.split("/");
    let fechaContacto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    contacto.fechaUltimoContacto = fechaContacto;
    paciente.id = this.idPaciente;
    contacto.paciente = paciente;

    this.service.editarContacto(contacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha editado correctamente el contacto.";
      this.openMessageDialog();
      this.showEditarContacto = false;

      this.buscarContactos();
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        console.log(error);
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  mostrarAgregarContacto(){
    this.showAgregarContacto = true;
    this.hoy = new Date();
  }

  closeAgregarContacto(){
    this.showAgregarContacto = false;
    this.agregarContactoFormGroup.controls.nroDocumento.setValue(null);
    this.agregarContactoFormGroup.controls.nombres.setValue(null);
    this.agregarContactoFormGroup.controls.apellidos.setValue(null);
    this.agregarContactoFormGroup.controls.telefono.setValue(null);
    this.agregarContactoFormGroup.controls.domicilio.setValue(null);
    this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(null);
    this.agregarContactoFormGroup.controls.tipo.setValue(null);
  }

  agregarContacto(){
    this.loading = true;
    let contacto = new CensoContacto();
    let paciente = new Paciente();
    contacto.nroDocumento = this.agregarContactoFormGroup.controls.nroDocumento.value;
    contacto.nombres = this.agregarContactoFormGroup.controls.nombres.value;
    contacto.apellidos = this.agregarContactoFormGroup.controls.apellidos.value;
    contacto.telefono = this.agregarContactoFormGroup.controls.telefono.value;
    contacto.domicilio = this.agregarContactoFormGroup.controls.domicilio.value;
    let dateParts = this.agregarContactoFormGroup.controls.fechaUltimoContacto.value.split("/");
    let fechaContacto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    contacto.fechaUltimoContacto = fechaContacto;
    contacto.tipo = this.agregarContactoFormGroup.controls.tipo.value;

    paciente.id = this.idPaciente;
    contacto.paciente = paciente;

    this.service.agregarContacto(contacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha creado correctamente el contacto.";
      this.openMessageDialog();
      this.showAgregarContacto = false;
      this.agregarContactoFormGroup.controls.nroDocumento.setValue(null);
      this.agregarContactoFormGroup.controls.nombres.setValue(null);
      this.agregarContactoFormGroup.controls.apellidos.setValue(null);
      this.agregarContactoFormGroup.controls.telefono.setValue(null);
      this.agregarContactoFormGroup.controls.domicilio.setValue(null);
      this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(null);
      this.agregarContactoFormGroup.controls.tipo.setValue(null);

      this.buscarContactos();
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        console.log(error);
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  confirmarBorrado(id){
    this.showBorrarContacto = true;
    this.idContacto = id;
  }

  closePopupBorrarContacto(){
    //this.nroCelularCambiar = '';
    this.showBorrarContacto = false;
  }

  borrarContacto(){

    this.service.borrarContacto(this.idContacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha borrado correctamente el contacto.";
      this.openMessageDialog();
      this.showBorrarContacto = false;

      this.buscarContactos();
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
