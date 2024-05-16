export type RegistroCargaTiempo = {
    comentario: string;
    horas: number;
    minutos: number;
    fechaDeCarga: Date;
    fechaDeActualizacion: Date;
    usuarioDeCreacion: {
        name: string;
    }
};