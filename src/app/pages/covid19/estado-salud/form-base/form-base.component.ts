import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {FieldInfo} from '../model/field-info';
import {calendarEsLocale} from '../../../../util/calendar-es-locale';

@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css']
})
export class FormBaseComponent {

  @Input() form: FormGroup;
  @Input() errores: any;
  @Input() fields: FieldInfo[];
  @Input() disabled = false;

  readonly smileyOptions = [
    {id: '1', descripcion: 'Muy poco'},
    {id: '2', descripcion: 'Poco'},
    {id: '3', descripcion: 'Ni mucho ni poco'},
    {id: '4', descripcion: 'Algo'},
    {id: '5', descripcion: 'Mucho'},
  ];

  readonly es = calendarEsLocale;

  constructor() { }

  showField(field: FieldInfo, model: any): boolean {
    return field.conditions ? field.conditions.map(
      c => model[c.fieldName] === c.fieldValue
    ).every(x => x) : true;
  }
}
