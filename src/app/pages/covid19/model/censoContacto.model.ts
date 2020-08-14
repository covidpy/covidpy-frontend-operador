import {Paciente} from './paciente.model'
export class CensoContacto {
    id: number;
    nombres: string;
    apellidos: string;
    nroDocumento: string;
    telefono: string;
    domicilio: string;
    fechaCreacion: Date;
    fechaUltimoContacto: Date;
    tipo: string;
    paciente: Paciente;
}