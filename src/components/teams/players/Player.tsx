import { useFormContext } from 'react-hook-form'
import React, { useContext } from 'react'
import { Button, FormErrorMessage, HStack, Input, Radio, useRadioGroup } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import CountryRadio from '@components/teams/players/CountryRadio'
import { FaEnvelope } from 'react-icons/fa'
import { TeamContext } from '@components/teams/teamContext'
import { useInvitations } from '@components/teams/invitationContext'
import { features } from '@lib/features'

export default function Player({ player, order, captainRadioProps }): JSX.Element {
    const { register, formState, setValue, getValues } = useFormContext()

    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext
    const { invitations, loading: invitationsLoading, inviteUser, getInvitation } = useInvitations()
    const { errors } = formState
    const radioOptions = [
        {
            label: '🇨🇦',
            value: 'CA'
        }
        , {
            label: '🇺🇸',
            value: 'USA'
        }]

    const defaultCountry = (player.country !== '' && player.country) ? player.country : 'CA'
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'country',
        defaultValue: defaultCountry,
        onChange: (nextValue) => {
            setValue(`players.${order}.country`, nextValue, {
                shouldDirty: true
            })
        }

    })
    const group = getRootProps()

    const renderInvite = (): JSX.Element => {
        if (features.invite) {
            const userEmail = getValues(`players.${order}.email`)
            if (!invitationsLoading && player.id) {
                if (user.email !== userEmail && !(!!error()?.email) && userEmail !== '' && userEmail) {
                    const invitation = getInvitation(userEmail)
                    if (!invitation) {
                        return (
                            <Button onClick={(e) => inviteUser(e, userEmail)} type='button'
                                    colorScheme='blue'>Invite&nbsp;
                                <FaEnvelope />
                            </Button>
                        )
                    } else {
                        return <>Sent Already</>
                    }

                }
            }
        }
        return <></>

        // return true
    }

    const error = () => {
        if ('players' in errors) {
            if (typeof errors.players[order] !== 'undefined') {
                return errors.players[order]
            }
        }
    }

    const setMe = (e) => {
        e.preventDefault()
        setValue(`players.${order}.email`, user.email)
    }

    return (
        <div
            className='flex flex-col mx bordered border rounded-xl w-full max-w-3xl mb-4 ml-4'>
            <div className='flex items-center justify-between text-main font-medium pt-3 px-4 pr-6'>
                <div>Player {order + 1} {!player.required && '(Optional)'} {(order === 0) &&
                <Button onClick={setMe} type={'button'} size='xs'>Me</Button>}</div>
                <div>{player.required && (
                    <>
                        <Radio className='ml-2' {...captainRadioProps} >Team Captain</Radio>
                        <input type='checkbox'
                               defaultChecked={captainRadioProps.isChecked}
                               {...register(`players.${order}.is_captain`)}
                               hidden />
                        <input type='text'
                               hidden
                               defaultValue={player.id}
                               {...register(`players.${order}.id`)} />
                    </>
                )}</div>
            </div>
            <div className='flex flex-row px-3 py-2 pb-4'>
                <div className='flex-grow w-full px-2 max-w-lg justify-between'>
                    <FormControl isInvalid={!!error()?.email} isRequired={true} id={`email${order}`}>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            defaultValue={player.email}
                            {...register(`players.${order}.email`)}
                            placeholder='Email Address'
                            type='email' />
                        <FormErrorMessage>{error()?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id={`uplay${order}`} isRequired={true} isInvalid={!!error()?.uplay}>
                        <FormLabel>Uplay</FormLabel>
                        <Input defaultValue={player.uplay}
                               {...register(`players.${order}.uplay`)}
                               placeholder='Uplay ID'
                               type='text' />
                        <FormErrorMessage>{error()?.uplay?.message}</FormErrorMessage>
                    </FormControl>
                </div>
                <div className='px-12 flex-1 flex flex-col justify-between pb-2'>
                    <FormControl>
                        <FormLabel>Country</FormLabel>
                        <input id={`players.${order}.country`}
                               defaultValue={defaultCountry}
                               hidden
                               {...register(`players.${order}.country`)} />
                        <HStack {...group}>
                            {radioOptions.map((radioValue) => {
                                const { value, label } = radioValue
                                const radio = getRadioProps({ value })
                                return (
                                    <CountryRadio order={order} key={value} {...radio}>
                                        {label}
                                    </CountryRadio>
                                )
                            })}
                        </HStack>
                    </FormControl>
                    {renderInvite()}
                </div>
            </div>

        </div>
    )
}