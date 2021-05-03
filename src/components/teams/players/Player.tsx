import { useFormContext } from 'react-hook-form'
import React, { useContext, useEffect, useState } from 'react'
import { Button, FormErrorMessage, HStack, Input, Radio, useRadioGroup, useRadioGroupContext } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import CountryRadio from '@components/teams/players/CountryRadio'
import { FaEnvelope } from 'react-icons/fa'
import { TeamContext } from '@components/teams/teamContext'

export default function Player({ player, order, captainRadioProps }): JSX.Element {
    const { register, formState, setValue, getValues } = useFormContext()

    const teamContext = useContext(TeamContext)
    const { user } = teamContext

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

    const showInvite = (): boolean => {
        const userEmail = getValues(`players.${player.index}.email`)
        if (user.email === userEmail) {
            return false
        }
        return true
    }
    const error = () => {
        if ('players' in errors) {
            if (typeof errors.players[order] !== 'undefined') {
                return errors.players[order]
            }
        }
    }
    return (
        <div
            className='flex flex-col mx bordered border rounded-xl w-full max-w-3xl mb-4 ml-4'>
            <div className='flex items-center justify-between text-main font-medium pt-3 px-4 pr-6'>
                <div>Player {order + 1} {!player.required && '(Optional)'}</div>
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
                        <Input required={false}
                               defaultValue={player.email}
                               {...register(`players.${order}.email`)}
                               placeholder='Email Address'
                               type='email' />
                        <FormErrorMessage>{error()?.email.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl id={`uplay${order}`}>
                        <FormLabel>Uplay</FormLabel>
                        <Input defaultValue={player.uplay}
                               {...register(`players.${order}.uplay`)}
                               placeholder='Uplay ID'
                               type='text' />
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
                    {showInvite() && (<Button colorScheme='blue'>Invite&nbsp;<FaEnvelope /></Button>)}
                </div>
            </div>

        </div>
    )
}