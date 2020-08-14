import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';
declare var $: any;

@Component({
  selector: "clave-seguridad-selector",
  templateUrl: "./clave-seguridad.component.html",
  providers: [Covid19Service]
})
export class ClaveSeguridadComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;


  public numeroDocumento: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;
  public tipoDocumento: any;
  public nombre: string;
  public apellido: string;
  public direccion: string;
  public contrasenha: string;
  public contrasenhaConfirm: string;

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public codigoVerif: string;

  public idRegistro: number;

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
    console.log("Clave seguridad");

    this.numeroDocumento = localStorage.getItem('numeroDocumento');
    this.nombre = localStorage.getItem('nombre');
    this.apellido = localStorage.getItem('apellido');

    console.log(localStorage.getItem('nombre'));

    this._route.params.subscribe(params => {
      this.idRegistro = params["idRegistro"];

      console.log(this.idRegistro);
    });
  }

  setearClave(clave){
    this.loading = true;
    this.service.setearClave(this.idRegistro, clave).subscribe(response => {        
            this.loading = false;
            this.mensaje = "Se ha registrado con Éxito";
            localStorage.setItem('token',response);
            //window.open("https://app.coronavirus.gov.py/login?token="+response);
            //this._router.navigate(["covid19/carga-operador/mensaje-final/"]);
            console.log(this.mensaje);
        }, error => {
            this.loading = false;
            this.mensaje = "No se pudo procesar la operación!";
            console.log(this.mensaje);
        }
    );
  }

  openMessageDialog() {
    setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
