import React from 'react'
import { FormControl, FormLabel, FormHelperText, FormControlOptions } from '@chakra-ui/form-control'
import { Input, Divider, FormErrorMessage } from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaTwitch, FaTwitter } from 'react-icons/fa'
import firebaseClient from '@lib/firebase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useRedirect from '@components/Layout/useRedirect'

const schema = yup.object().shape({
    email: yup.string().email().required('Email Address is Required'),
    password: yup.string().min(8).required('Please Enter a Password'),
    passwordConfirmation: yup.string().min(8).oneOf([yup.ref('password')], 'Passwords Must Match').required()
})

interface RegisterFormInputs {
    email: string;
    password: string;
    passwordConfirmation: string;
}


export default function RegisterForm() {
    const router = useRouter()
    const { redirect, getNext } = useRedirect()

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
    return (
        <div className='px-8'>
            <div
                className='px-12 py-8 sm:px-16 md:px-20 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered'>
                <div
                    className='w-full text-center mb-4 font-bold text-2xl dark:text-gray-200 text-gray-900 mb-6'>
                    Register Your CCL Account
                </div>
                <div className='space-y-3 mb-4 flex flex-col md:flex-row items-center space-x-2 md:space-y-0'>
                    <button
                        className='social-button bg-twitter hover:bg-twitter-darker text-gray-50'>
                        <FaTwitter className='mr-2' />Twitter Sign Up
                    </button>
                    <button
                        className='social-button bg-twitch hover:bg-twitch-darker text-gray-50'>
                        <FaTwitch className='mr-2' />Twitch Sign Up
                    </button>
                </div>
                <Divider className='my-4' />
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
                        <Input type='password' name='password' placeholder='Password' {...register('password')} />
                        <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                        id='passwordConfirmation'
                        isInvalid={!!errors?.passwordConfirmation?.message && Object.keys(touchedFields).length > 2}
                        isRequired
                    >
                        <FormLabel>Confirm Password</FormLabel>
                        <Input type='password' name='passwordConfirmation' placeholder='Confirm Password'
                               {...register('passwordConfirmation')} />
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