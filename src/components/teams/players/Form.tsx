import React, { useContext, useEffect, useReducer } from 'react'
import { TeamContext } from '@components/teams/teamContext'
import { Teams } from '@lib/models/team'
import { IPlayer, basePlayers } from '@lib/models/player'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, useRadioGroup, useToast } from '@chakra-ui/react'
import Player from '@components/teams/players/Player'
import Loader from '@components/Loader'


// TODO: GET YUMRESOLVER BACK WORKING FUCK MAN
// TODO: LOCK TEAM CHANGES?

function findWithAttr(array, attr, value) {
    let idx = []
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            idx.push(i)
        }
    }
    return idx
}


yup.addMethod(yup.array, 'unique', function(message, mapper = a => a) {
    return this.test('unique', message, function(list) {
        let listWithValues = list.map(mapper).filter(val => val != '')
        if (listWithValues.length > 0) {
            const counts = listWithValues.reduce((acc: Record<string, number>, val: string, idx) => {
                if (!(val in acc)) {
                    acc[val] = 1
                } else {
                    acc[val] += 1
                }
                return acc
            }, {})
            const indexes = Object.keys(counts)
                .filter(key => counts[key] > 1)
                .reduce((acc: number[], val: string) => {
                    const values = findWithAttr(list, 'email', val)
                    return [...acc, ...values]
                }, [])
            if (indexes.length > 0) {
                const [idx] = indexes
                return this.createError({ path: `players.${idx}.email`, message: 'Cannot use the same email address' })
            }
        }
        return true
    })
})

const schema = yup.object().shape({
    players: yup.array().of(
        yup.object().shape({
            email: yup.string().email('Must be a Valid Email'),
            is_captain: yup.boolean()
        })
    ).unique('duplicate email', a => a.email)
})


export default function PlayerForm({ players }) {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext
    const toast = useToast()

    const methods = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        defaultValues: {
            players
        }
    })

    const { formState: { isValid, dirtyFields }, setValue, getValues } = methods


    const getDefaultCaptain = () => {
        let defaultCaptain = 'players.0'
        for (let i = 0; i < players.length; i += 1) {
            if (players[i].is_captain) {
                return `players.${i}`
            }
        }
        return defaultCaptain
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'captain',
        defaultValue: getDefaultCaptain(),
        onChange: (value) => {
            const { players } = getValues()
            const idx = findWithAttr(players, 'is_captain', true)
            const [captain] = idx
            // @ts-ignore
            setValue(`${value}.is_captain`, true, {
                shouldDirty: true
            })
            // @ts-ignore
            setValue(`players.${captain}.is_captain`, false, {
                shouldDirty: true
            })
        }
    })

    const captainGroup = getRootProps()

    const onSubmit = data => {
        if (isValid && dirtyFields.players) {
            const { players } = data
            const validPlayers = players
                .map((p, i) => ({ ...p, index: i }))
                .filter((player) => player.email !== '')
                .filter((player) => typeof dirtyFields?.players[player.index] !== 'undefined')

            const playersCollection = Teams.getPlayersCollection(team.id)
            validPlayers.forEach((player) => {
                console.log('valid: ', player)
                if (player.id && player.id !== '') {
                    console.log('EXISTING OBJECT', player)
                } else {
                    console.log('NEW PLAYER: ', player)
                }
                if (player.id && player.id !== '') {
                    const { id } = player
                    delete player.id
                    playersCollection.collection('players').doc(id).update({
                        ...player
                    }).then(() => {
                        toast({
                            title: `Updated Player ${player.index + 1}`,
                            duration: 1000,
                            status: 'info',
                            position: 'top-right'
                        })
                    })
                } else {
                    playersCollection.collection('players').add({
                        ...player
                    }).then((result) => {
                        toast({
                            title: `Added Player ${player.index + 1}`,
                            duration: 1000,
                            status: 'success',
                            position: 'top-right'
                        })
                    })
                }
            })
        }
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className='player-wrapper flex flex-col max-w-7xl mx-auto items-center' {...captainGroup}>
                        <div className='text-right max-w-3xl w-full'>
                            <div className='space-x-4'>
                                <Button colorScheme='green' type='submit'>Save</Button>
                            </div>
                            <div className='font-normal text-red-400 pt-2' />
                        </div>
                        {players.map((player, idx) => {
                            return (<Player order={idx} key={`player-${idx}`} player={player}
                                            captainRadioProps={getRadioProps({ value: `players.${idx}` })} />)
                        })}
                        <div className='text-right max-w-3xl w-full'>
                            <div className='space-x-4'>
                                <Button colorScheme='green' type='submit'>Save</Button>
                            </div>
                            <div className='font-normal text-red-400 pt-2' />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}