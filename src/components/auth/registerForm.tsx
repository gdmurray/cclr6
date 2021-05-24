import React, { useState } from 'react'
import { FormControl, FormLabel, FormHelperText, FormControlOptions } from '@chakra-ui/form-control'
import { Input, Divider, FormErrorMessage, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaEye, FaEyeSlash, FaTwitch, FaTwitter } from 'react-icons/fa'
import firebaseClient from '@lib/firebase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useRedirect from '@components/Layout/useRedirect'

require('yup-password')(yup)

const schema = yup.object().shape({
    email: yup.string().email().required('Email Address is Required'),
    password: yup.string()
        .required('Please Enter a Password')
        .min(8, 'Password Must be at least 8 characters long')
        .minUppercase(1, 'Password Must Contain at Least 1 Uppercase Letter')
        .minNumbers(1, 'Password Must Contain at Least 1 Number'),
    passwordConfirmation: yup.string().oneOf([yup.ref('password')], 'Passwords Must Match').required()
})

interface RegisterFormInputs {
    email: string;
    password: string;
    passwordConfirmation: string;
}

interface ShowPassword {
    password: boolean;
    passwordConfirmation: boolean
}

export default function RegisterForm() {
    const router = useRouter()
    const { redirect, getNext } = useRedirect()
    const [showPassword, setShowPassword] = useState<ShowPassword>({
        password: false,
        passwordConfirmation: false
    })
    const { register, handleSubmit, setError, formState: { errors, touchedFields } } = useForm<RegisterFormInputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })


    const onSubmit = data => {
        try {
            const { email, password } = data
            firebaseClient.auth().createUserWithEmailAndPassword(email, password).then((result) => {
                router.push(redirect)
            })
        } catch (e) {
            // todo: set errors if theres an error
            const { code, message } = e
            setError('passwordConfirmation', {
                message
            })
        }

    }

    const togglePassword = (e, name: keyof ShowPassword) => {
        e.preventDefault()
        setShowPassword({
            ...showPassword,
            [name]: !showPassword[name]
        })
    }
    return (
        <div className='px-8'>
            <div
                className='px-10 py-8 sm:px-16 md:px-20 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered'>
                <div
                    className='w-full text-center mb-4 font-bold text-2xl dark:text-gray-200 text-gray-900 mb-6'>
                    Register Your CCL Account
                </div>
                <form className='w-full max-w-xl mb-8' onSubmit={handleSubmit(onSubmit)}>
                    <FormControl
                        id='email'
                        isInvalid={!!errors?.email?.message && Object.keys(touchedFields).length > 2}
                        isRequired
                    >
                        <FormLabel>Email</FormLabel>
                        <Input type='email' name='email' placeholder='Email Address' {...register('email')} />
                        <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                        id='password'
                        isInvalid={!!errors?.password?.message}
                        isRequired
                    >
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input type={showPassword.password ? 'text' : 'password'}
                                   name='password'
                                   placeholder='Password'
                                   {...register('password')} />
                            <InputRightElement
                                children={<IconButton onClick={(e) => togglePassword(e, 'password')} variant='outline'
                                                      type='button'
                                                      size='xs'
                                                      aria-label={'Show'}
                                                      icon={showPassword.password ? <FaEyeSlash /> : <FaEye />} />} />
                        </InputGroup>

                        <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                        id='passwordConfirmation'
                        isInvalid={!!errors?.passwordConfirmation?.message && Object.keys(touchedFields).length > 2}
                        isRequired
                    >
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                            <Input type={showPassword.passwordConfirmation ? 'text' : 'password'}
                                   name='passwordConfirmation'
                                   placeholder='Confirm Password'
                                   {...register('passwordConfirmation')} />
                            <InputRightElement
                                children={<IconButton onClick={(e) => togglePassword(e, 'passwordConfirmation')}
                                                      variant='outline'
                                                      type='button'
                                                      size='xs'
                                                      aria-label={'Show'}
                                                      icon={showPassword.passwordConfirmation ? <FaEyeSlash /> :
                                                          <FaEye />} />} />
                        </InputGroup>
                        <FormErrorMessage>{errors?.passwordConfirmation?.message}</FormErrorMessage>
                    </FormControl>
                    <div className='px-0 sm:px-6 md:px-12 mt-12 mb-4'>
                        <button
                            className='social-button dark:bg-white dark:hover:bg-gray-100 text-gray-800 transition-all'
                            type='submit'>
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className='font-medium text-sm tracking-tight text-center dark:text-gray-300 '>Already have an
                    account?&nbsp;&nbsp;
                    <Link href={getNext('/login')}>
                        <span
                            className='cursor-pointer font-semibold text-primary hover:text-red-500 transition-all duration-150'>Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}