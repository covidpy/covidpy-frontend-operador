import { Injectable } from '@angular/core';
import { Credentials } from '../pages/login/model/credentials.model';
import { StorageManagerService } from '../pages/login/shared/storage-manager.service';

@Injectable(
  {providedIn: 'root'}
)
export class PermissionGuardService {

  constructor(private storageManager: StorageManagerService) { }


  hasPermission(permission: string): boolean {

    let login = this.storageManager.getLoginData();

    if (login) {
      for (let i = 0; i < login.usuario.rols.length; i++) {
        let r = login.usuario.rols[i];

        for (let j = 0; i < r.permisos.length; j++) {

          let p = r.permisos[j];

          if (!p)
            return false;

          if (permission == p.nombre)
            return true
        }

      }
    }

    return false;

  }

  hasRol(rol: string): boolean {


    let login = this.storageManager.getLoginData();

    if (login) {
      for (let i = 0; i < login.usuario.rols.length; i++) {
        let r = login.usuario.rols[i];

        if (!r)
          return false;

        if (r.nombre == rol)
          return true;
      }
    }
    return false;
  }


  credentialHasPermission(permission: string, login: Credentials): boolean {
    if (login) {
      for (let i = 0; i < login.usuario.rols.length; i++) {
        let r = login.usuario.rols[i];
        for (let j = 0; i < r.permisos.length; j++) {
          let p = r.permisos[j];
          if (!p){
            return false;
          }
          
          if (permission == p.nombre) {
            return true;
          }
        }
      }
    }

    return false;

  }
}
