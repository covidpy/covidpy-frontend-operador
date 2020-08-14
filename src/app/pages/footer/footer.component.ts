import { Component } from '@angular/core';
import { AppConfig } from "app/app.config";

@Component({
  selector: 'footer-widget',
  templateUrl: './footer.html',
  styleUrls: ["./footer.component.css"]

})

export class FooterComponent {
  
  constructor(
    private config: AppConfig
  ) { 
  } 
  
  getRssServicios() {
    return this.config.API + "/rss/servicios";
  }

  getRssInstituciones() {
    return this.config.API + "/rss/instituciones";
  }

}
