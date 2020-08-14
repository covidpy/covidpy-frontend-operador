import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEditarRolComponent } from './usuario-editar-rol.component';

describe('UsuarioEditarRolComponent', () => {
  let component: UsuarioEditarRolComponent;
  let fixture: ComponentFixture<UsuarioEditarRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioEditarRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioEditarRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
