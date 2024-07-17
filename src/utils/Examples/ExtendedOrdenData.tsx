import {
  Archivo,
  ArchivoFichaTecnica,
  AtributoPrenda,
  ComplejidadConfeccion,
  ContenidoFichaTencica,
  CotizacionOrden,
  DetallesPrenda,
  EstadoOrden,
  FichaTecnica,
  Orden,
  PrecioPrenda,
  Servicio,
  TipoPrenda,
  User,
} from "@prisma/client";

export type ExtendedOrdenData = Orden & {
  archivos: Archivo[];
  estado: EstadoOrden;
  user: User;
  prenda: PrecioPrenda & {
    complejidad: ComplejidadConfeccion;
    tipo: TipoPrenda;
  };
  cotizacionOrden: CotizacionOrden[];
  detallesPrenda: DetallesPrenda & { atributos: AtributoPrenda[] };
  mensajes: {
    id: string;
    message: string;
    timestamp: string;
    user: { email: string; name: string };
  }[];
  procesos: {
    estado: string;
    idEstado: number;
    proceso: string;
    idProceso: number;
    icon: string;
    id: string;
    lastUpdated: Date;
    precioActualizado: number;
    ficha: FichaTecnica & {
      archivos: ArchivoFichaTecnica[];
      contenido: ContenidoFichaTencica;
    };
    recursos: { key: string; text: string }[];
  }[];
  procesosProductivos: {
    estado: string;
    idEstado: number;
    proceso: string;
    idProceso: number;
    icon: string;
    id: string;
    lastUpdated: Date;
    precioActualizado: number;
    ficha: FichaTecnica & {
      archivos: ArchivoFichaTecnica[];
      contenido: ContenidoFichaTencica;
    };
    recursos: { key: string; text: string }[];
  }[];
  servicios: Servicio[];
};
