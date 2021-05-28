import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Button, FormErrorMessage, Input } from '@chakra-ui/react'
import React, { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import EmptyState from '@components/EmptyState'
import { FaEnvelope } from 'react-icons/fa'

const schema = yup.object().shape({
    email: yup.string().email().required('Email address is required')
})

interface ResetPasswordFormInputs {
    email: string;
}

type State = {
    loading: boolean;
    sent: boolean;
    error?: string;
}

type Action =
    | { type: 'loading' }
    | { type: 'success' }
    | { type: 'error', error: string }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true
            }
        case 'error':
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case 'success':
            return {
                loading: false,
                sent: true,
                error: undefined
            }
    }
}

const ResetPasswordForm = (): JSX.Element => {
    const { query } = useRouter()
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        sent: false,
        error: undefined
    })
    const { email } = query
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ResetPasswordFormInputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (email) {
            reset({ email: email as string })
        }
    }, [])

    const onSubmit = data => {
        dispatch({ type: 'loading' })
        const { email } = data
        fetch('/api/auth/password_reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            if (!result.ok) {
                result.json().then(response => {
                    const { message } = response
                    setError('email', {
                        type: 'manual',
                        message
                    })
                })
            } else {
                dispatch({ type: 'success' })
            }
        })
    }

    if (state.sent) {
        return (
            <div>
                <EmptyState icon={<FaEnvelope />} text={'Password Reset Email Sent!'}
                            subtext={'Please check your email folder shortly, if it does not appear, be sure to check the Spam folder'} />
            </div>
        )
    }

    return (
        <div>
            <form className='w-full max-w-xl mb-8' onSubmit={handleSubmit(onSubmit)}>
                <FormControl
                    id={'email'}
                    isRequired
                    isInvalid={!!errors?.email?.message}>
                    <FormLabel>Email</FormLabel>
                    <Input type='email' name='email' placeholder='Email Address' {...register('email')} />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
                <div className='text-right'>
                    <Button
                        w={225}
                        colorScheme='green'
                        isLoading={isSubmitting}
                        type='submit'
                    >
                        Send Password Reset
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordForm