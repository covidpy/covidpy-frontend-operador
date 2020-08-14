import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';
declare var $: any;

@Component({
  selector: "carga-codigo-selector",
  templateUrl: "./carga-codigo.component.html",
  providers: [Covid19Service]
})
export class CargaCodigoComponent implements OnInit {
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
  public direccion: string;
  public codigo: string;

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public idRegistro: number;
  public nombre: string;
  public apellido: string;

  constructor(
    private _router: Router,
    private service: Covid19Service
  ) {
    this.loading = false;
    /*if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }*/
  }

  ngOnInit() {
    //this.qrCode = 'qwertyu';
    this.nombre = localStorage.getItem("nombre");
    this.apellido = localStorage.getItem("apellido");

    this.idRegistro = +localStorage.getItem("idRegistro");
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  validarTelefono(codigoVerif: string){
    this.loading = true;
    this.service.validarTelefonoIngresoPais(this.idRegistro, codigoVerif).subscribe(response => {
            console.log(response);
            
            this.loading = false;
            this.mensaje = "Mensaje Enviado con Éxito";
            this._router.navigate(["covid19/ingreso-pais/datos-clinicos/",this.idRegistro, codigoVerif]);

          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo validar el teléfono!";
            this.openMessageDialog();
            
          }
    );
  }

  avanzar(telefono: string): void {
    this.loading = true;
        this.service.sendMessage(telefono).subscribe(response => {
            console.log(response);
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
