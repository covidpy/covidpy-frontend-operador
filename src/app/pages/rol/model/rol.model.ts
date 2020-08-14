import { Permiso } from "../../permiso/model/permiso.model";

export class Rol {
    id: number;
    activo: boolean;
    nombre: string;
    descripcion: string;
    permisos: Permiso[];
}