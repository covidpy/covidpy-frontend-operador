import { Rol } from "../../rol/model/rol.model";

export class Usuario {
    id: number;
    activo: boolean;
    apellido: string;
    cargo: string;
    cedula: string;
    email: string;
    estadoContacto: boolean;
    nombre: string;
    password: string;
    telefono: string;
    username: string;
    rols: Rol[];
}