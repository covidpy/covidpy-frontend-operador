import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarClaveComponent } from './generar-clave.component';

describe('GenerarClaveComponent', () => {
  let component: GenerarClaveComponent;
  let fixture: ComponentFixture<GenerarClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
