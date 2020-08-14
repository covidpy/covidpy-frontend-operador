import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCrearComponent } from './usuario-crear.component';

describe('UsuarioCrearComponent', () => {
  let component: UsuarioCrearComponent;
  let fixture: ComponentFixture<UsuarioCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
