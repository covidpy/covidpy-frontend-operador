import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';
declare var $: any;

@Component({
  selector: "mensaje-final-operador-selector",
  templateUrl: "./mensaje-final-operador.component.html",
  providers: [Covid19Service]
})
export class MensajeFinalOperadorComponent implements OnInit {

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

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public token:string;
  public codigoVerif: string;

  constructor(
    private _router: Router,
    private service: Covid19Service
  ) {
    this.loading = false;
    /*if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }*/
    this.token=localStorage.getItem('token');
  }

  ngOnInit() {
    //this.codigoVerif = localStorage.getItem('codigoVerif');

    this.numeroDocumento = localStorage.getItem('numeroDocumento');
    this.nombre = localStorage.getItem('nombre');
    this.apellido = localStorage.getItem('apellido');

    console.log(localStorage.getItem('nombre'));
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

}
