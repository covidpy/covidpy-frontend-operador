import { Injectable } from "@angular/core";
import { Observable , Subject } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MessageService {

  public divider: string = "45";
  public dividerDefault: string = "0";
  public TITLE_BUSCADOR = "Buscar Información";
  public TITLE_BUSCADOR_OCULTO = "Ocultar Buscador";

  public buscadorVisible: boolean = false;
  // Observable string sources
  private formDataSearch = new Subject<any>();
  // Observable string streams
  public formDataSearchResult = this.formDataSearch.asObservable();

  // Observable string sources
  private currentUserService = new Subject<any>();
  // Observable string streams
  public currentUserResult = this.currentUserService.asObservable();

  constructor(private http: HttpClient, private config: AppConfig) { }

  emitChangeCurrentUserService(change: any) {
    this.currentUserService.next(change);
  }

  // Service message commands
  emitChangeDataSearch(change: any) {
    this.formDataSearch.next(change);
  }


}
