import React, { useEffect } from 'react'
import { FaTwitch, FaTwitter } from 'react-icons/fa'
import { Divider, FormErrorMessage, Input } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import Link from 'next/link'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../lib/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import Loader from '../Loader'
import { useRouter } from 'next/router'


const schema = yup.object().shape({
    email: yup.string().email().required('Email Address is Required'),
    password: yup.string().required('Password is Required')
})

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginForm = (): JSX.Element => {
    const { push } = useRouter()

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    })

    const { signinWithEmail, Twitter, loading, user } = useAuth()

    useEffect(() => {
        if (user !== null) {
            push('/')
        }
    }, [user])

    const onSubmit = data => {
        const { email, password } = data
        signinWithEmail(email, password, '/').catch(err => {
            const { code, message } = err
            if (code === 'auth/wrong-password') {
                setError('password', {
                    message
                })
            } else {
                setError('password', {
                    message
                })
            }

        })
    }

    if (loading) {
        return (
            <Loader text={'Logging You In'} />
        )
    }

    return (
        <>
            <div className='space-y-3 mb-4 flex flex-col md:flex-row items-center md:space-x-2 md:space-y-0'>
                <button
                    onClick={Twitter.login}
                    className='social-button bg-twitter hover:bg-twitter-darker'>
                    <FaTwitter className='mr-2' />Twitter Login
                </button>
                <button
                    disabled={true}
                    className='social-button bg-twitch hover:bg-twitch-darker'>
                    <FaTwitch className='mr-2' />Twitch Login
                </button>
            </div>
            <Divider className='my-4' />
            <form className='w-full max-w-xl mb-8' onSubmit={handleSubmit(onSubmit)}>
                <FormControl
                    id='email'
                    isRequired
                    isInvalid={!!errors?.email?.message}
                >
                    <FormLabel>Email</FormLabel>
                    <Input type='email' name='email' placeholder='Email Address' {...register('email')} />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                    id='password'
                    isRequired
                    isInvalid={!!errors?.password?.message}
                >
                    <FormLabel>Password</FormLabel>
                    <Input type='password' name='password' placeholder='Password' {...register('password')} />
                    <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                </FormControl>
                <div className='px-0 sm:px-6 md:px-12 mt-12 mb-4'>
                    <button
                        className='social-button dark:bg-white dark:hover:bg-gray-100 text-gray-800 transition-all'
                        type='submit'>
                        Sign In
                    </button>
                    <div
                        className='mt-2 block text-right text-sm tracking-tight font-semibold text-primary hover:text-red-500 transition-all duration-150'>
                        <div>Forgot Password</div>
                    </div>
                </div>
            </form>
            <div className='font-medium text-sm tracking-tight text-center dark:text-gray-300 '>Already have an
                account?&nbsp;&nbsp;
                <Link href='/login'>
                        <span
                            className='cursor-pointer font-semibold text-primary hover:text-red-500 transition-all duration-150'>Sign In</span>
                </Link>
            </div>
        </>
    )
}

export default LoginForm