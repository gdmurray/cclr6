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
import React, { useRef } from 'react'
import { useAuth } from '@lib/auth'
import { ITeam, Teams } from '@lib/models/team'
import Loader from '../Loader'
import useRedirect from '../Layout/useRedirect'
import { useRouter } from 'next/router'
import { useTeamForm } from '@components/teams/useTeamForm'


export default function RegisterTeamForm(): JSX.Element {

    const uploadRef = useRef<HTMLInputElement>()

    const { push } = useRouter()
    const { redirect } = useRedirect('/team/players')
    const { methods, handleLogoClick, handleLogoClear, handleFileInput } = useTeamForm({ uploadRef })
    const { getValues, handleSubmit, register, formState: { errors, isSubmitting } } = methods

    const { user, loading: userLoading } = useAuth()

    if (userLoading || !user) {
        return (
            <Loader text={'Loading Team Registration'} />
        )
    }


    const handleCreate = (data: ITeam) => {
        Teams.createTeam(data, user).then((result) => {
            console.log('CREATE TEAM...')
            result.get().then((data) => {
                const createdTeam = {
                    id: data.id,
                    ...data.data()
                }
                console.log(createdTeam)
                push(redirect)
            })
        }).catch((err) => {
            console.log('ERROR', err)
            // handle error
        })
    }

    const onSubmit = data => {
        const contactEmail = data.contact ? data.contact : user.email!
        handleCreate({
            name: data.name,
            logo: data.logo,
            owner: user.uid,
            contact_email: contactEmail
        })
    }

    const { logo } = getValues()
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-row justify-between'>
                <div className='w-32 pt-6'>
                    <FormControl isInvalid={!!errors?.logo?.message}>
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
                            src={logo}
                        />
                        <input accept='.png, .jpg, .jpeg' id='logo'
                               type='file'
                               hidden={true}
                               onChange={handleFileInput}
                               ref={uploadRef} />
                        <div
                            className='pt-3 text-alt-2 text-main font-normal text-sm text-center'>Upload Logo
                        </div>
                        <FormErrorMessage>{errors?.logo?.message}</FormErrorMessage>
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
                    <Button colorScheme='green' type='submit' isLoading={isSubmitting}>
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