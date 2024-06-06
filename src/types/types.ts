export type RegistroCargaTiempo = {
  id: string;
  comentario: string;
  horas: number;
  minutos: number;
  fechaDeCarga: Date;
  fechaDeActualizacion: Date;
  usuarioDeCreacion: {
    name: string;
  };
};

export enum TipoDeAccioModal {
  ELIMINAR,
  EDITAR,
  CARGA,
}
