import { Component, OnInit, Inject, DoCheck } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ScrollToService } from "ng2-scroll-to-el";
import { MessageService } from "app/services/MessageService";
import { LoginService } from 'app/pages/login/shared/login.service';
import { AppConfig } from "app/app.config";
import { DOCUMENT } from '@angular/common';
import { StorageManagerService } from 'app/pages/login/shared/storage-manager.service';
declare var $: any;

@Component({
  selector: "header-widget",
  templateUrl: "./header.html",
  providers: [LoginService],
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent  implements DoCheck {

  public categoriaTramite: any;
  public lang: string = 'G';
  public ieUrl: string;
  public token: string;
  public currentUser: any;
  public uuid: string;
  public fotoPerfil: any;

  constructor(
    private route: ActivatedRoute,
    private scrollService: ScrollToService,
    public messageService: MessageService,
    private router: Router,
    private auth: LoginService,
    private config: AppConfig,
    @Inject(DOCUMENT) private document: any,
    private storageManagerService: StorageManagerService
  ) {  }

  ngDoCheck() {
    this.currentUser = this.storageManagerService.getLoginData();
  }

  scrollToTop(event) {
    this.scrollService.scrollTo(event);
  }

  colapseMenu(){
    $('#menu-principal').removeClass('show');
  };

  searchDataCategoria(data) {
    this.router.navigate(["/categoria/", data.id_clasificador, 'resultado']);
  }

  searchData(data: any, topSite: any) {
    let busqueda = {};
    if (data != null) {
      busqueda = { data: data.nombre_clasificador, id: data.id_clasificador, origen: "categoria", visible: false };
    } else {
      busqueda = { data: null, id: null, origen: null, visible: true };
    }
    this.messageService.emitChangeDataSearch(busqueda);
  }

  logout(){
    this.currentUser = null;
    this.storageManagerService.deleteStorage();
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    this.router.navigate(['/']);
  }

  redirectExternUrl(url){
    this.router.navigate(["/"]).then(result=>{ window.location.href = url; });
  }

  redirect(datoActualizado){
    if(datoActualizado){
      this.router.navigate(['/perfil-ciudadano']);
    } else {
      this.router.navigate(['/form-perfil-ciudadano']);
    }
  }

  isLogin()
  {
    return window.location.hash=='#/';
  }

}
