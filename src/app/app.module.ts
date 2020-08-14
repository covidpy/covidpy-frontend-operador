import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { ScrollToModule } from "ng2-scroll-to";
import { ScrollToService } from "ng2-scroll-to-el";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material";
import { routing, routesComponents, appRoutingProviders } from "./app.routing";
import { AppComponent } from "./app.component";
import { OwlModule } from "ng2-owl-carousel";
import { MaterialDesignFrameworkModule } from "angular6-json-schema-form";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2OrderModule } from "ng2-order-pipe";
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from "ng-recaptcha";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { CapitalizePipe } from "./pipes/capitalize.pipe";
import { KeysPipe } from "./pipes/keys.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { SlugPipe } from "./pipes/slug.pipe";
import { SplitPipe } from "./pipes/split.pipe";
import { SafeHtmlPipe } from "./pipes/safehtml.pipe";
import { FilterdataPipe } from "./pipes/filterdata.pipe";
import { ArraySortPipe } from "./pipes/orderby.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MyDatePickerModule } from "app/lib/angular4-datepicker/src/my-date-picker";
import "hammerjs";
import {DemoMaterialModule} from './material-module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { ModalModule } from './lib/modal-custom';
import { CargaCodigoComponent } from './pages/covid19/ingreso-pais/carga-codigo.component';
import { DatosClinicosComponent } from './pages/covid19/datos-clinicos.component';
import { RegistroPacienteComponent } from './pages/covid19/registro-paciente.component';
import {RegistroIngresoPaisComponent} from './pages/covid19/ingreso-pais/registro-ingreso-pais.component';
import {MensajeFinalIngresoComponent} from './pages/covid19/ingreso-pais/mensaje-final-ingreso.component';
import { DropdownModule } from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
//import { GooglePlaceModule } from "ngx-google-places-autocomplete";
//import { QRCodeModule } from 'angularx-qrcode';
import { MostrarDatosPacienteComponent } from "./pages/covid19/mostrar-datos-paciente.component";
import { MostrarDatosAlPacienteComponent } from "./pages/covid19/mostrar-datos-al-paciente.component";
import { HomeOperadorComponent } from "./pages/covid19/home-operador.component";
import { MensajeFinalComponent } from "./pages/covid19/mensaje-final.component";
import { LoginComponent } from './pages/login/login.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { WebStorageModule } from 'ngx-store';
import { CambiarClaveComponent } from './pages/login/cambiar-clave/cambiar-clave.component';
import { GenerarClaveComponent } from './pages/login/generar-clave/generar-clave.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { RolComponent } from './pages/rol/rol.component';
import { RolCrearComponent } from './pages/rol/rol-crear/rol-crear.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsuarioCrearComponent } from './pages/usuario/usuario-crear/usuario-crear.component';
import { UsuarioEditarRolComponent } from './pages/usuario/usuario-editar-rol/usuario-editar-rol.component';
import { GrowlModule } from 'primeng/growl';
import {BlockUIModule, ConfirmationService, FieldsetModule, OverlayPanelModule, ProgressSpinnerModule, SpinnerModule, TooltipModule} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatosClinicosIngresoComponent } from "./pages/covid19/ingreso-pais/datos-clinicos-ingreso.component";
import { OperadorIngresoPaisPaciente } from './pages/covid19/operador-ingreso-pais-paciente.component';
import { DatosBasicosOperadorComponent } from "./pages/covid19/carga-operador/datos-basicos-operador.component";
import { DatosClinicosOperadorComponent } from "./pages/covid19/carga-operador/datos-clinicos-operador.component";
import { MensajeFinalOperadorComponent } from "./pages/covid19/carga-operador/mensaje-final-operador.component";
import { ClaveSeguridadComponent } from "./pages/covid19/carga-operador/clave-seguridad.component";
import {CalendarModule} from 'primeng/calendar';
import { OperadorTomaMuestraLaboratorial } from "./pages/covid19/operador-toma-muestra-laboratorial.component";
import {ReporteNoUbicacionComponent} from "./pages/covid19/reporte-no-ubicacion/reporte-no-ubicacion.component";
import {ReporteNoUbicacionService} from "./pages/covid19/reporte-no-ubicacion/shared/reporte-no-ubicacion.service";
import {HttpModule} from "@angular/http";
import {HttpErrorHandler} from "./util/http.error.handler";
import { DatePipe } from "@angular/common";
import {TipoPacienteService} from "./pages/covid19/reporte-no-ubicacion/shared/tipo-paciente.service";
import { HistoricoSaludComponent } from './pages/covid19/estado-salud/historico-salud/historico-salud.component';
import { ActualizarEstadoSaludComponent } from './pages/covid19/estado-salud/actualizar-estado-salud/actualizar-estado-salud.component';
import { HeaderBaseComponent } from './pages/covid19/header-base/header-base.component';
import { FormBaseComponent } from './pages/covid19/estado-salud/form-base/form-base.component';
import { VisualizarEstadoSaludComponent } from './pages/covid19/estado-salud/visualizar-estado-salud/visualizar-estado-salud.component';
import { ContactosPaciente } from "./pages/covid19/contactos-paciente.component";

@NgModule({
  // Declaración de componentes
  declarations: [
    AppComponent,
    routesComponents,
    CapitalizePipe,
    SafePipe,
    SlugPipe,
    SplitPipe,
    SafeHtmlPipe,
    FilterdataPipe,
    KeysPipe,
    ArraySortPipe,
    CargaCodigoComponent,
    DatosClinicosComponent,
    RegistroPacienteComponent,
    MostrarDatosPacienteComponent,
    MostrarDatosAlPacienteComponent,
    HomeOperadorComponent,
    MensajeFinalComponent,
    LoginComponent,
    CambiarClaveComponent,
    GenerarClaveComponent,
    PermisoComponent,
    RolComponent,
    RolCrearComponent,
    UsuarioComponent,
    UsuarioCrearComponent,
    UsuarioEditarRolComponent,
    RegistroIngresoPaisComponent,
    DatosClinicosIngresoComponent,
    MensajeFinalIngresoComponent,
    DatosBasicosOperadorComponent,
    DatosClinicosOperadorComponent,
    MensajeFinalOperadorComponent,
    ClaveSeguridadComponent,
    OperadorIngresoPaisPaciente,
    OperadorTomaMuestraLaboratorial,
    ReporteNoUbicacionComponent,
    HistoricoSaludComponent,
    ActualizarEstadoSaludComponent,
    HeaderBaseComponent,
    FormBaseComponent,
    VisualizarEstadoSaludComponent,
    ContactosPaciente,
  ],
  // dependencias de módulos
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ScrollToModule.forRoot(),
    routing,
    OwlModule,
    BrowserAnimationsModule,
    MaterialDesignFrameworkModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    RecaptchaModule.forRoot(),
    //RecaptchaFormsModule,
    MyDatePickerModule,
    NgbModule.forRoot(),
    MatSnackBarModule,
    DemoMaterialModule,
    ChartjsModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    ModalModule,
    RecaptchaV3Module,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    //QRCodeModule,
    MessagesModule,
    MessageModule,
    WebStorageModule,
    ReactiveFormsModule,
    GrowlModule,
    BlockUIModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MultiSelectModule,
    //GooglePlaceModule
    CalendarModule,
    FieldsetModule,
    OverlayPanelModule,
    SpinnerModule,
    TooltipModule
  ],
  providers: [
    appRoutingProviders,
    ScrollToService,
    ReporteNoUbicacionService,
    HttpErrorHandler,
    TipoPacienteService,
    DatePipe,
    { provide: RECAPTCHA_LANGUAGE, useValue: "es" },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LfJyuMUAAAAAIV7rrC6RWZdrotQYQfHCbrLIgAY' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
