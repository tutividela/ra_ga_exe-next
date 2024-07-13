import { z } from "zod";

export const OrderFieldsUpdateSchema = z.object({
  orderId: z.string(),
  precioPrendaId: z.string(),
  idEstado: z.number(),
});

export type OrderFieldsUpdateSchemaType = z.infer<
  typeof OrderFieldsUpdateSchema
>;
