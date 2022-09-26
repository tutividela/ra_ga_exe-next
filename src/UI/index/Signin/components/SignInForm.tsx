import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import React, { useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorHandlerContext } from '../../../../utils/ErrorHandler/error'
import FormItem from '../../../Forms/FormItem'
import { signInLayout } from '../forms/signin.layout'
import { SignInSchema } from '../forms/signinSchema'
import SignInButtons from './SignInButtons'

interface SignInFormProps {
    onClose: () => void
    onRecovery: () => void
    onLoading: (value: boolean) => void
}

export type SignInData = {
    email: string,
    password: string,
}

const SignInForm = (props: SignInFormProps) => {

    const { onClose, onRecovery, onLoading } = props
    const { addError } = useContext(ErrorHandlerContext)
    const [errorFlag, setErrorFlag] = useState(false)


    const formContext = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(SignInSchema)
    })


    const loginSubmit = async (data: SignInData) => {
        try {
            onLoading(true)
            const res = await signIn("credentials", {
                username: data?.email,
                password: data?.password,
                redirect: false
            });

            if (res.error) {
                const errorMessage = JSON.parse(res.error)?.error as string || 'Login Invalido'
                const message = typeof errorMessage === 'object' ? 'Login Invalido' : errorMessage

                addError(message)
                throw new Error(message)
            }
            onClose()
        }

        catch (error) {
            setErrorFlag(true)
            onLoading(false)
        }
    }

    return (
        <FormProvider  {...formContext}>
            <form onSubmit={formContext.handleSubmit(loginSubmit)} className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center" >
                    <div className='w-64 mx-4'>
                        <FormItem layout={signInLayout} />
                    </div>
                    {errorFlag && <div className='text-xs mt-2 text-red-600'>
                        <p>Inicio de sesion incorrecto</p>
                    </div>}
                    <div className='mt-3 text-xs text-cyan-600'>
                        <button type='button' onClick={onRecovery} >{'Olvidó su contraseña?'}</button>
                    </div>
                </div>
                <SignInButtons onClose={onClose} />
            </form>
        </FormProvider>
    )
}


export default SignInForm
