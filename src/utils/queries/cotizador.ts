import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { FileUploadResponse } from "@pages/api/drive/upload";
import { TipoPrenda } from "@prisma/client";


// Cargar archivos a Google Drive
export type FileUploadData = { clientName: string, orderID: string, formData: FormData }
export type DriveUploadResponse = { data: FileUploadResponse | FileUploadResponse[] }
export type ErrorMessage = { error: string }

export const errorHandle = (res: Response) => res.json().then(json => Promise.reject(json))


// Obtener lista de ropas
export const getClothes = (): Promise<TipoPrenda[]> => fetch('/api/clothes/obtain')
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { throw error });

// Agregar nueva prenda
export const addClothes = (data: TipoPrenda): Promise<TipoPrenda> => fetch('/api/clothes/new', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
})
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { throw error });

export const getClothingAndPrices = (id: string): Promise<TipoPrenda> => fetch(`/api/clothes/obtain/${id}`)
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { throw error });

// Obtener lista de complejidades
export const getComplexity = () => fetch('/api/complexity/obtain')
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { throw error });

// Cargar archivos a Google Drive
export const uploadFile = (data: FileUploadData): Promise<DriveUploadResponse> => fetch(`/api/drive/upload?client=${data.clientName}&order=${data.orderID}`, { method: 'POST', body: data.formData })
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { console.log('Broke here'); throw error });

// Crear orden
export const createOrder = (data: OrderCreationData): Promise<{ message: string }> => fetch(`/api/order/new`, { method: 'POST', headers: { "Content-Type": "application/json", accept: "application/json" }, body: JSON.stringify(data) })
    .then(res => res.ok ? res.json() : errorHandle(res))
    .catch((error) => { throw error });


export const updateFileURL = (data: OrderCreationData, file: FileUploadResponse, mapKeys: { [key: string]: string }) => {
    if (mapKeys[file.fileName] === 'molderiaBase.files') {
        data.molderiaBase.files = data.molderiaBase.files.map(el => el.name === file.fileName ? { ...el, urlID: file.file.data.id } : el)
    }
    else if (mapKeys[file.fileName] === 'geometral.files') {
        data.geometral.files = data.geometral.files.map(el => el.name === file.fileName ? { ...el, urlID: file.file.data.id } : el)
    }
    else if (mapKeys[file.fileName] === 'logoMarca.files') {
        data.logoMarca.files = data.logoMarca.files.map(el => el.name === file.fileName ? { ...el, urlID: file.file.data.id } : el)
    }
}