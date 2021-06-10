import React, { useEffect, useState } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import {
    Input,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Button,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaCheck, FaEye, FaEyeSlash, FaQuestionCircle, FaTimes, FaTwitch, FaTwitter } from 'react-icons/fa'
import firebaseClient from '@lib/firebase/firebase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useRedirect from '@components/Layout/useRedirect'

require('yup-password')(yup)

enum PasswordValidation {
    REQUIRED = 'Password is Required',
    MIN_LENGTH = 'Password must be at least 8 characters long',
    MIN_UPPER = 'Password must contain at least 1 uppercase letter',
    MIN_NUMBERS = 'Password must contain at least 1 number',
    MUST_MATCH = 'Passwords must match',
}

const passwordSchema = yup
    .string()
    .required(PasswordValidation.REQUIRED)
    .min(8, PasswordValidation.MIN_LENGTH)
    .minUppercase(1, PasswordValidation.MIN_UPPER)
    .minNumbers(1, PasswordValidation.MIN_NUMBERS)

const matchingPasswordSchema = yup.object().shape({
    password: passwordSchema,
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password')], PasswordValidation.MUST_MATCH)
        .required(PasswordValidation.MUST_MATCH),
})

const schema = yup.object().shape({
    email: yup.string().email().required('Email address is required'),
    password: passwordSchema,
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], PasswordValidation.MUST_MATCH)
        .required(PasswordValidation.MUST_MATCH),
})

interface RegisterFormInputs {
    email: string
    password: string
    passwordConfirmation: string
}

interface ShowPassword {
    password: boolean
    passwordConfirmation: boolean
}

interface PasswordChecklist {
    [PasswordValidation.REQUIRED]: boolean
    [PasswordValidation.MIN_LENGTH]: boolean
    [PasswordValidation.MIN_UPPER]: boolean
    [PasswordValidation.MIN_NUMBERS]: boolean
    [PasswordValidation.MUST_MATCH]: boolean
}

export default function RegisterForm() {
    const router = useRouter()
    const { redirect, getNext } = useRedirect()
    const [passwordChecklist, setPasswordChecklist] = useState<PasswordChecklist>({
        [PasswordValidation.REQUIRED]: false,
        [PasswordValidation.MIN_LENGTH]: false,
        [PasswordValidation.MIN_UPPER]: false,
        [PasswordValidation.MIN_NUMBERS]: false,
        [PasswordValidation.MUST_MATCH]: false,
    })

    const [showPassword, setShowPassword] = useState<ShowPassword>({
        password: false,
        passwordConfirmation: false,
    })
    const {
        register,
        handleSubmit,
        setError,
        getValues,
        formState: { errors, touchedFields, isValidating, isSubmitting },
    } = useForm<RegisterFormInputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (!isValidating) {
            validatePasswords()
        }
    }, [isValidating])

    const onSubmit = (data) => {
        const { email, password } = data
        firebaseClient
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                fetch('/api/auth/verify', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: result.user.email,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((result) => {
                    if (result.ok) {
                        router.push(redirect)
                    }
                })
            })
            .catch((err) => {
                const { code, message } = err
                const emailCodes = ['auth/invalid-email', 'auth/email-already-in-use', 'auth/operation-not-allowed']
                if (emailCodes.indexOf(code) !== -1) {
                    setError('email', {
                        type: 'manual',
                        message,
                    })
                }
                if (code === 'auth/weak-password') {
                    setError('passwordConfirmation', {
                        type: 'manual',
                        message,
                    })
                }
            })
    }

    const togglePassword = (e, name: keyof ShowPassword) => {
        e.preventDefault()
        setShowPassword({
            ...showPassword,
            [name]: !showPassword[name],
        })
    }

    function validatePasswords() {
        const { password, passwordConfirmation } = getValues()
        let errors: string[] = []
        try {
            matchingPasswordSchema.validateSync({ password, passwordConfirmation }, { abortEarly: false })
        } catch (err) {
            errors = err.errors
        } finally {
            const newChecklist = Object.keys(passwordChecklist).reduce((acc, val) => {
                acc[val] = errors.indexOf(val) === -1
                return acc
            }, passwordChecklist)
            setPasswordChecklist({ ...newChecklist })
        }
    }

    const PasswordRequirementsPopover = (): JSX.Element => {
        return (
            <Popover trigger="hover">
                <PopoverTrigger>
                    <span className="ml-1 cursor-pointer text-alt-2">
                        <FaQuestionCircle />
                    </span>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Password Requirements</PopoverHeader>
                    <PopoverBody>
                        <div className="space-y-0.5">
                            {Object.keys(passwordChecklist).map((check) => {
                                const value = passwordChecklist[check] as boolean
                                return (
                                    <div key={check} className="flex flex-row">
                                        {value ? (
                                            <FaCheck className="text-success mt-0.5 mr-1 " />
                                        ) : (
                                            <FaTimes className="text-error mt-0.5 mr-0.5" />
                                        )}{' '}
                                        {check}
                                    </div>
                                )
                            })}
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <div className="px-8">
            <div className="px-10 py-8 sm:px-16 md:px-20 flex flex-col justify-center w-full mx-auto max-w-xl border rounded-md bordered">
                <div className="w-full text-center mb-4 font-bold text-2xl dark:text-gray-200 text-gray-900 mb-6">
                    Register Your CCL Account
                </div>
                <form className="w-full max-w-xl mb-8 py-4" onSubmit={handleSubmit(onSubmit)}>
                    <FormControl
                        id="email"
                        isInvalid={!!errors?.email?.message && Object.keys(touchedFields).length > 1}
                        isRequired
                    >
                        <FormLabel>Email</FormLabel>
                        <Input type="email" name="email" placeholder="Email Address" {...register('email')} />
                        <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="password" isInvalid={!!errors?.password?.message} isRequired>
                        <FormLabel style={{ display: 'flex' }} className="flex flex-row items-center">
                            Password&nbsp;
                            <PasswordRequirementsPopover />
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword.password ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                {...register('password')}
                            />
                            <InputRightElement
                                children={
                                    <IconButton
                                        onClick={(e) => togglePassword(e, 'password')}
                                        variant="outline"
                                        type="button"
                                        size="xs"
                                        aria-label={'Show'}
                                        icon={showPassword.password ? <FaEyeSlash /> : <FaEye />}
                                    />
                                }
                            />
                        </InputGroup>

                        <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                        id="passwordConfirmation"
                        isInvalid={!!errors?.passwordConfirmation?.message && touchedFields.passwordConfirmation}
                        isRequired
                    >
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword.passwordConfirmation ? 'text' : 'password'}
                                name="passwordConfirmation"
                                placeholder="Confirm Password"
                                {...register('passwordConfirmation')}
                            />
                            <InputRightElement
                                children={
                                    <IconButton
                                        onClick={(e) => togglePassword(e, 'passwordConfirmation')}
                                        variant="outline"
                                        type="button"
                                        size="xs"
                                        aria-label={'Show'}
                                        icon={showPassword.passwordConfirmation ? <FaEyeSlash /> : <FaEye />}
                                    />
                                }
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors?.passwordConfirmation?.message}</FormErrorMessage>
                    </FormControl>
                    <div className="px-0 sm:px-6 md:px-12 mt-6 mb-4">
                        <Button isLoading={isSubmitting} width="full" type="submit">
                            Sign Up
                        </Button>
                    </div>
                </form>
                <div className="font-medium text-sm tracking-tight text-center dark:text-gray-300 ">
                    Already have an account?&nbsp;&nbsp;
                    <Link href={getNext('/login')}>
                        <span className="cursor-pointer font-semibold text-primary hover:text-red-500 transition-all duration-150">
                            Sign In
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
