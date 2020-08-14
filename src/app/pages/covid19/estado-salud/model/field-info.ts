import {FieldCondition} from './field-condition';

export class FieldInfo {
  hintText: string;
  fieldName: string;
  fieldType: string;
  fieldMaxLength: string;
  inputLength: string;
  isRequired: string;
  optionsSource: any[];
  optionsTextProp: string;
  optionsIdProp: string;
  label: string;
  icon: string;
  page: string;
  conditions: FieldCondition[];
}
