export const generateOrderID = (
  nombreDeUusario: string,
  nombreTipoPrenda: string
) => {
  const today = new Date();
  const dateFormat = `${today.getDate()}${
    today.getMonth() + 1
  }${today.getFullYear()}-${today.getHours()}${today.getMinutes()}`;

  return `${nombreDeUusario.substring(0, 3).toUpperCase()}-${nombreTipoPrenda
    .substring(0, 3)
    .toUpperCase()}-${dateFormat}`;
};
