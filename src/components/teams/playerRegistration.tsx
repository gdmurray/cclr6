import { useAuth } from '../../lib/auth'
import useTeam from '../../lib/useTeam'
import Loader from '../Loader'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { Box, Button, HStack, IconButton, Input, useColorMode, useRadio, useRadioGroup } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'


function CountryRadio(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
    const input = getInputProps()
    const checkbox = getCheckboxProps()
    const { colorMode } = useColorMode()
    return (
        <Box as={'label'}>
            <input disabled={props.disabled} {...input} />
            <Box
                disabled={props.disabled}
                _disabled={{
                    borderColor: 'gray !important',
                    background: '#57534E',
                    opacity: 0.5,
                    cursor: 'not-allowed'
                }}
                {...checkbox}
                className='dark:hover:bg-gray-800'
                cursor='pointer'
                borderWidth='2px'
                borderRadius='md'
                boxShadow='md'
                _checked={{
                    borderWidth: '2px',
                    borderColor: '#e50a25',
                    background: (colorMode === 'light') ? '#FEE2E2' : '#57534E'
                }}
                _focus={{
                    boxShadow: 'outline'
                }}
                p={1}
                py={0}
            >
                <span className='text-3xl'>{props.children}</span>
            </Box>

        </Box>
    )
}

function Player({ player }): JSX.Element {
    const { order } = player
    const { register, formState, getValues, setValue, trigger } = useFormContext()
    const { touchedFields } = formState

    let disabled = (order > (touchedFields.players || []).filter(elem => elem !== undefined).length)

    const [radioState, setRadioState] = useState<string>('CA')
    const radioOptions = [
        {
            label: '🇨🇦',
            value: 'CA'
        }
        , {
            label: '🇺🇸',
            value: 'USA'
        }]
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'country',
        defaultValue: 'CA',
        onChange: (nextValue) => {
            setValue(`players.${order}.country`, nextValue, {
                shouldValidate: true
            })
            setRadioState(nextValue)
            // trigger('players')
        }

    })

    const group = getRootProps()
    return (
        <div
            className={`${disabled ? 'disabled' : ''} flex flex-col bordered border rounded-xl w-full max-w-xl mb-4 ml-4`}>
            <div className='text-main font-medium pt-3 px-4'>
                Player {order + 1}
            </div>
            <div className='flex flex-row px-3 py-2 pb-4'>
                <div className='flex-grow w-full px-2'>
                    <FormControl isDisabled={disabled} id={`email${order}`}>
                        <FormLabel>Email Address</FormLabel>
                        <Input {...register(`players.${order}.email`)} placeholder='Email Address' type='email' />
                    </FormControl>
                    <FormControl isDisabled={disabled} id={`uplay${order}`}>
                        <FormLabel>Uplay</FormLabel>
                        <Input {...register(`players.${order}.uplay`)} placeholder='Uplay ID' type='text' />
                    </FormControl>
                </div>
                <div className='px-12 flex-1 '>
                    <FormControl>
                        <FormLabel>Country</FormLabel>
                        <input id={`players.${order}.country`}
                               defaultValue={radioState}
                               hidden
                               {...register(`players.${order}.country`)} />
                        <HStack {...group}>
                            {radioOptions.map((radioValue) => {
                                const { value, label } = radioValue
                                const radio = getRadioProps({ value })
                                return (
                                    <CountryRadio disabled={disabled} order={order} key={value} {...radio}>
                                        {label}
                                    </CountryRadio>
                                )
                            })}
                        </HStack>
                    </FormControl>
                </div>
            </div>

        </div>
    )
}


const schema = Yup.object().shape({
    players: Yup.array().of(
        Yup.object().shape({
            email: Yup.string().email().required('Email Address is Required').nullable()
        })
    ).min(2)
})

export default function PlayerRegistration(): JSX.Element {
    const { user, loading: userLoading } = useAuth()
    const { team } = useTeam({ user })
    const methods = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema)
    })
    const { formState, getValues } = methods
    const { touchedFields, errors } = formState
    console.log(errors)

    const players = [
        {
            order: 0
        },
        {
            order: 1
        },
        {
            order: 2
        },
        {
            order: 3
        },
        {
            order: 4
        },
        {
            order: 5
        }
    ]
    if (userLoading || !user) {
        return (
            <Loader text={'Loading Team Registration'} />
        )
    }
    const onSubmit = data => console.log(data)
    return (
        <div className='mx-auto'>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className='player-wrapper flex flex-wrap mx-auto'>
                        {players.map((player) => {
                            return (<Player key={`player-${player.order}`} player={player} />)
                        })}
                    </div>
                    <div className='px-4 space-x-4 text-right'>
                        <Button type='submit'>Register</Button>
                        <Button type='submit'>Register and Invite</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}