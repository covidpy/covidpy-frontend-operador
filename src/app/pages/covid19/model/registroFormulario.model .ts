import { Registro } from "./registro.model";

export class RegistroFormulario {
    id: number;
    registro: Registro;
    registroFormularioAcompanante: boolean;
    nombre: string;
    estado: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
}