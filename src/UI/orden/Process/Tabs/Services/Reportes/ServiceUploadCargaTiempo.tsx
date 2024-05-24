import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { LayoutElement } from "@UI/Forms/types";
import { CargaDeTiempoType } from "@backend/schemas/CargaDeTiempoSchema";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";

type Props = {
    open: boolean;
    onClose: () => void,
}

export const cargaDeTiempoLayout: LayoutElement<CargaDeTiempoType> = {
    type: 'Horizontal',
    elements: [
        {
            type: 'Input',
            label: 'Horas',
            scope: 'horas',
            className: 'mr-2 mb-2',
            width: 2,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Minutos',
            scope: 'minutos',
            className: 'mr-2 mb-2',
            width: 2,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Comentarios',
            scope: 'comentario',
            width: 10,
            options: {
                multiline: 3,
            },
        }
    ]
}

export default function ServiceUploadCargaTiempo({open, onClose}: Props) {
    return(  
    <Dialog open={open} onClose={onClose} fullWidth={true}>
        <DialogTitle className="self-center text-2xl m">Carga de tiempo</DialogTitle>
        <LoadingIndicator show={false}>
            <DialogContent>
                <HookForm
                    defaultValues={{
                        horas: 0,
                        minutos: 0,
                        comentario: ''
                    }}
                    onSubmit={() => console.log('hola')}
                >
                    <FormItem layout={cargaDeTiempoLayout}/>
                </HookForm>
            </DialogContent>
            <div className="flex justify-center m-3">
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => console.log('tiempo cargado')}>Cargar</Button>
            </div>
        </LoadingIndicator>
    </Dialog>
    );
}