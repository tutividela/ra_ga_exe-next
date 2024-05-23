import { Paths } from "@UI/Types/nestedObjTypes";
import { z } from "zod";

export const OrderCreationDataSchema = z.object({
    atributosPrenda: z.object({
        material: z.object({
            selected: z.boolean(),
            observaciones: z.string()
        }),
        bolsillos: z.object({
            selected: z.boolean(),
            cantidad: z.number(),
            observaciones: z.string()
        }),
        botones: z.object({
            selected: z.boolean(),
            cantidad: z.number(),
            observaciones: z.string()
        }),
        cierre: z.object({
            selected: z.boolean(),
            observaciones: z.string()
        }),
        elastico: z.object({
            selected: z.boolean(),
            cantidad: z.number(),
            observaciones: z.string()
        }),
        manga: z.object({
            selected: z.boolean(),
            observaciones: z.string()
        }),
        genero: z.object({
            selected: z.boolean(),
            observaciones: z.string(),
            values: z.array(z.object({
                key: z.string(),
                text: z.string(),
            }))
        }),
    }),
    nombreProducto: z.string(),
    complejidad: z.string(),
    cliente: z.string(),
    geometral: z.object({
        selected: z.boolean(),
        observaciones: z.string(),
        files: z.array(z.object({
            name: z.string(),
            urlID: z.string(),
            type: z.string()
        }))
    }),
    logoMarca: z.object({
        selected: z.boolean(),
        observaciones: z.string(),
        files: z.array(z.object({
            name: z.string(),
            urlID: z.string(),
            type: z.string()
        }))
    }),
    procesosDesarrolloSeleccionados: z.object({
        Diseño: z.object({selected: z.boolean()}),
        Molderia: z.object({ selected: z.boolean() }),
        ["Digitalización"]: z.object({ selected: z.boolean() }),
        Geometral: z.object({ selected: z.boolean() }),
        Impresion: z.object({ selected: z.boolean() }),
        Materiales: z.object({selected: z.boolean()}),
        Corte: z.object({ selected: z.boolean(), }),
        ["Pre-confección"]: z.object({selected: z.boolean()}),
        ["Confección"]: z.object({ selected: z.boolean() }),
        Tizado: z.object({selected: z.boolean()}),
        Terminado: z.object({ selected: z.boolean() }), 
    }),
    cotización: z.object({ selected: z.boolean() }),
    talles: z.string(),
    cantidad: z.string(),
    tipoPrenda: z.object({
        id: z.string().cuid(),
        name: z.string().min(1, { message: 'El nombre de la prenda no puede estar vacío' }),
        picture: z.string().optional()
    }),
    user: z.object({
        name: z.string(),
        email: z.string().email(),
    }),
    orderFiles: z.object({
        observaciones: z.string(),
        files: z.array(z.object({
            name: z.string(),
            urlID: z.string(),
            type: z.string()
        }))
    }),
})

export type ValidatedOrderSchema = z.infer<typeof OrderCreationDataSchema>

export type OrderCreationData = ValidatedOrderSchema & { files: { file: File, section: Paths<ValidatedOrderSchema> }[] }