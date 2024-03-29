import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaTwitter } from 'react-icons/fa'
import { Button, Divider, FormErrorMessage, IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import Link from 'next/link'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useAuth } from '@lib/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import Loader from '../Loader'
import { useRouter } from 'next/router'
import useRedirect from '../Layout/useRedirect'
import useKeypress from '@components/useKeypress'

const schema = yup.object().shape({
    email: yup.string().email().required('Email address is required'),
    password: yup.string().required('Password is required'),
})

interface LoginFormInputs {
    email: string
    password: string
}

interface LoginFormProps {
    redirect: string
}

const LoginForm = ({ redirect }: LoginFormProps): JSX.Element => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [formLoading, setFormLoading] = useState<boolean>(false)
    const { push } = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        getValues,
    } = useForm<LoginFormInputs>({
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    })

    const { signinWithEmail, Twitter, loading: authLoading } = useAuth()

    const loading = authLoading || formLoading

    useKeypress('Enter', (e) => {
        e.stopPropagation()
        const { target } = e
        if (target.nodeName === 'INPUT') {
            e.preventDefault()
            handleSubmit(onSubmit)()
        }
    })

    const onSubmit = (data) => {
        setFormLoading(true)
        const { email, password } = data
        signinWithEmail(email, password, redirect).catch((err) => {
            setFormLoading(false)
            const { code, message } = err
            if (code === 'auth/wrong-password') {
                setError('password', {
                    message,
                })
            } else {
                setError('password', {
                    message,
                })
            }
        })
    }

    if (loading) {
        return <Loader text={'Logging You In'} />
    }

    const forgotPassword = () => {
        const { email } = getValues()
        if (email) {
            push({ pathname: '/auth/password_reset', query: { email } })
        } else {
            push('/auth/password_reset')
        }
    }

    const toggleShowPassword = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowPassword(!showPassword)
    }

    return (
        <>
            <div className="space-y-3 mb-4 flex flex-col md:flex-row items-center md:space-x-2 md:space-y-0">
                <button
                    onClick={Twitter.login}
                    className="social-button text-gray-50 bg-twitter hover:bg-twitter-darker"
                >
                    <FaTwitter className="mr-2" />
                    Twitter Login
                </button>
            </div>
            <Divider className="my-6" />
            <form className="w-full max-w-xl mb-8" onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="email" isRequired isInvalid={!!errors?.email?.message}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" placeholder="Email Address" {...register('email')} />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isRequired isInvalid={!!errors?.password?.message}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            {...register('password')}
                        />
                        <InputRightElement>
                            <IconButton
                                onClick={toggleShowPassword}
                                variant="outline"
                                type="button"
                                size="xs"
                                aria-label={'Show'}
                                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                </FormControl>
                <div className="px-0 sm:px-6 md:px-12 mt-6 mb-4">
                    <Button width="full" type="submit">
                        Sign In
                    </Button>
                    <div
                        onClick={forgotPassword}
                        className="cursor-pointer mt-2 block text-right text-sm tracking-tight font-semibold text-primary hover:text-red-500 transition-all duration-150"
                    >
                        <div>Forgot Password</div>
                    </div>
                </div>
            </form>
            <div className="font-medium text-sm tracking-tight text-center dark:text-gray-300 ">
                Don&#39;t have an account yet?&nbsp;&nbsp;
                <Link href="/register">
                    <span className="cursor-pointer font-semibold text-primary hover:text-red-500 transition-all duration-150">
                        Sign Up
                    </span>
                </Link>
            </div>
        </>
    )
}

export default LoginForm
