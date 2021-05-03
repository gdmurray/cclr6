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

function findWithAttr(array: any[], attr: string, value: any): number[] {
    let idx = []
    try {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                idx.push(i)
            }
        }
    } catch (err) {
        console.log('error finding attribute: ', array, attr, value)
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
                .reduce((acc: number[][], val: string) => {
                    const values = findWithAttr(list, 'email', val)
                    acc.push(values)
                    return acc
                }, [])
            if (indexes.length > 0) {
                const [idx] = indexes
                const [_, errorIndex] = idx
                return this.createError({
                    path: `players.${errorIndex}.email`,
                    message: 'Cannot use the same email address'
                })
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

export default function PlayerForm({ players, callback }) {
    const teamContext = useContext(TeamContext)
    const { team } = teamContext
    const toast = useToast()

    const methods = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema)
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

    interface TransactionResult {
        player: IPlayer;
        created: boolean;
    }

    const upsertPlayer = (ref, player): Promise<TransactionResult> => {
        return new Promise((resolve, reject) => {
            // Existing Player!
            if (player.id && player.id !== '') {
                const playerWithId = { ...player }
                delete player.id
                ref.collection('players').doc(playerWithId.id).update({
                    ...player
                }).then(() => {
                    resolve({
                        player: playerWithId,
                        created: false
                    })
                })
            } else {
                delete player.id;
                ref.collection('players').add({
                    ...player
                }).then((result) => {
                    result.get().then(data => {
                        resolve({
                            player: {
                                ...data.data(),
                                id: data.id
                            },
                            created: true
                        })
                    })
                })
            }
        })
    }
    const onSubmit = data => {
        if (isValid && dirtyFields.players) {
            const { players } = data
            const validPlayers = players
                .map((p, i) => ({ ...p, index: i }))
                .filter((player) => player.email !== '')
                .filter((player) => typeof dirtyFields?.players[player.index] !== 'undefined')

            const playersCollection = Teams.getPlayersCollection(team.id)

            Promise.all<TransactionResult>(validPlayers.map(player => upsertPlayer(playersCollection, player))).then((result: TransactionResult[]) => {
                result.forEach((updated) => {
                    if (updated.created) {
                        toast({
                            title: `Added Player ${updated.player.index + 1}`,
                            duration: 1000,
                            status: 'success',
                            position: 'top-right'
                        })
                    } else {
                        toast({
                            title: `Updated Player ${updated.player.index + 1}`,
                            duration: 1000,
                            status: 'info',
                            position: 'top-right'
                        })
                    }
                })
                const updatedPlayers = result.map(p => p.player);
                callback(updatedPlayers)
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