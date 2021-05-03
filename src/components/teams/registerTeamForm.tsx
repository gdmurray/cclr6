import {
    Button,
    FormControl, FormErrorMessage,
    FormHelperText,
    FormLabel,
    Image,
    Input,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react'
import { FaArrowRight, FaEnvelope, FaTimes, FaUsers } from 'react-icons/fa'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useAuth } from '@lib/auth'
import { storage } from '@lib/firebase'
import { ITeam, Teams } from '@lib/models/team'
import Loader from '../Loader'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRedirect from '../Layout/useRedirect'
import { useRouter } from 'next/router'

const schema = yup.object().shape({
    name: yup.string().min(3).max(32, 'Name cannot be longer than 32 characters').required('Team Name is Required'),
    contact: yup.string().email().notRequired()
})

type State = {
    logo?: File | string;
    loading: boolean;
    error?: string;
}

type Action =
    | { type: 'init', logo: string }
    | { type: 'upload', file: File }
    | { type: 'submit' }
    | { type: 'clear' }
    | { type: 'failure', error?: string }

function logoReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                logo: action.logo
            }
        case 'upload':
            return {
                loading: false,
                logo: action.file,
                error: undefined
            }
        case 'submit':
            return {
                ...state,
                loading: true
            }
        case 'clear':
            return {
                loading: false,
                logo: undefined,
                error: undefined
            }
        case 'failure':
            return {
                loading: false,
                logo: undefined,
                error: action.error
            }
    }
}


interface RegisterTeamFormInputs {
    name: string;
    contact: string;
}

export default function RegisterTeamForm(): JSX.Element {

    const uploadRef = useRef<HTMLInputElement>()

    const { push } = useRouter()
    const { redirect } = useRedirect('/team/players')
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm<RegisterTeamFormInputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const [{ logo, loading, error }, dispatch] = useReducer(logoReducer, {
        loading: false
    })

    const [logoImage, setLogoImage] = useState<string>()
    const { user, loading: userLoading } = useAuth()

    if (userLoading || !user) {
        return (
            <Loader text={'Loading Team Registration'} />
        )
    }

    const handleLogoClick = (): void => {
        if (uploadRef.current) {
            uploadRef.current.click()
        }
    }

    const handleFileInput = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        if (file) {
            const sizeInMb = file.size / 1024 / 1024
            if (sizeInMb > 2) {
                dispatch({ type: 'failure', error: 'Logo Cannot be Larger than 2mb' })
            } else {
                dispatch({ type: 'upload', file: file })
                setLogoImage(URL.createObjectURL(file))
            }
        }
    }


    const handleCreate = (data: ITeam) => {
        Teams.createTeam(data).then((result) => {
            result.get().then((data) => {
                const createdTeam = {
                    id: data.id,
                    ...data.data()
                }
                push(redirect)
            })
        }).catch((err) => {
            dispatch({ type: 'failure' })
        })
    }

    const onSubmit = data => {
        dispatch({ type: 'submit' })
        const contactEmail = data.contact ? data.contact : user.email!
        if (logo && (typeof logo !== 'string')) {
            const logoName = `${logo.lastModified}-${logo.name}`
            const uploadTask = storage.ref(`/images/${logoName}`).put(logo)
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    dispatch({ type: 'failure' })
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('images').child(logoName).getDownloadURL()
                        .then(fireBaseUrl => {
                            handleCreate({
                                name: data.name,
                                logo: fireBaseUrl,
                                owner: user.uid,
                                contact_email: contactEmail
                            })
                        })
                })
        } else {
            handleCreate({
                name: data.name,
                logo: undefined,
                owner: user.uid,
                contact_email: contactEmail
            })
        }

    }

    const handleLogoClear = () => {
        dispatch({ type: 'clear' })
        setLogoImage(null)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-row justify-between'>
                <div className='w-32 pt-6'>
                    <FormControl isInvalid={!!error}>
                        {logo && (
                            <span style={{
                                marginLeft: '-15px'
                            }} onClick={handleLogoClear}
                                  className='hover:text-primary float-right cursor-pointer text-main transition-colors duration-150'><FaTimes /></span>
                        )}

                        <Image
                            onClick={handleLogoClick}
                            className='mx-auto cursor-pointer'
                            borderRadius='full'
                            boxSize='100px'
                            fallbackSrc='https://via.placeholder.com/150?text=Logo'
                            src={(typeof logo === 'string') ? logo : logoImage}
                        />
                        <input accept='.png, .jpg, .jpeg' id='logo'
                               type='file'
                               hidden={true}
                               onChange={handleFileInput}
                               ref={uploadRef} />
                        <div
                            className='pt-3 text-alt-2 text-main font-normal text-sm text-center'>Upload Logo
                        </div>
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                </div>
                <div className='ml-4 px-8 max-w-md w-full'>
                    <div>
                        <FormControl id='name'
                                     isRequired={true}
                                     isInvalid={!!errors?.name?.message}>
                            <FormLabel>Team Name</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' children={<FaUsers />} />
                                <Input placeholder='Team Name'
                                       type='text' {...register('name')} />
                            </InputGroup>
                            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl id='contact'>
                            <FormLabel>Contact Email</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' children={<FaEnvelope />} />
                                <Input placeholder='Email Address'
                                       type='email' {...register('contact')} />
                            </InputGroup>
                            <FormHelperText>Leave Blank for your email</FormHelperText>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className='flex justify-end px-8'>
                <div className='text-right'>
                    <Button type='submit' isLoading={loading}>
                        Complete Registration&nbsp;&nbsp;<FaArrowRight className='text-xs' />
                    </Button>
                    <div className='mt-2 text-alt-2 font-normal text-sm tracking-tight text-center'>
                        This Information can be changed after registration
                    </div>
                </div>
            </div>
        </form>
    )
}