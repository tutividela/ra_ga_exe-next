export function generarMensajePorEstado(idEstado: number): string {
  switch (idEstado) {
    case 1:
      return "La orden aún no ha comenzado";
    case 2:
      return "Se esta esperando la seña a pagar";
    case 6:
      return "La orden se encuentra rechazada";
    case 7:
      return "La orden se encuentra expirada";
    case 8:
      return "La orden se encuentra cancelada";
    default:
      return "";
  }
}
