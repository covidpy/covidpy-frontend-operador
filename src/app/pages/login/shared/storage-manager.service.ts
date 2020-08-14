import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { SessionStorageService } from 'ngx-store';
import { Credentials } from '../model/credentials.model';

@Injectable(
  {providedIn: 'root'}
)
export class StorageManagerService implements OnInit, OnDestroy {

  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit() { }

  ngOnDestroy() { }

  saveSessionData(data: Credentials): Credentials {
    return this.sessionStorageService.set('session', data);
  }

  public getLoginData(): Credentials {
    return this.sessionStorageService.get('session');
  }

  deleteStorage() {
    this.sessionStorageService.clear();
  }
}
