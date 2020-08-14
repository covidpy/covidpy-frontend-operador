export class ReporteNoUbicacionSearch {
  resultadoUltimoDiagnostico: string;
  motivoIngreso: string;
  horaRetrasoMinimo: number;
  horaRetrasoMaximo: number = null;

  constructor() {
    this.resultadoUltimoDiagnostico = null;
    this.motivoIngreso = null;
    this.horaRetrasoMinimo = null;
  }
}
