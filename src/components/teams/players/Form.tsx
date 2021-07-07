import React, { useContext } from 'react'
import { TeamContext } from '@components/teams/teamContext'
import { Teams } from '@lib/models/team'
import { IPlayer } from '@lib/models/player'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, useRadioGroup, useToast } from '@chakra-ui/react'
import Player from '@components/teams/players/Player'
import { findWithAttr, isPlayerEqual } from '@lib/utils'
import { LockState } from '../../../pages/team/players'
import { getDefaultCaptain, playerFormSchema, TransactionResult } from '@lib/playerform'

export interface PlayerFormItem {
    id?: string
    email: string
    uplay: string
    is_captain: boolean
    required: boolean
    twitter?: string
    twitch?: string
}

interface PlayersForm {
    players: PlayerFormItem[]
    callback: (updatedPlayers: IPlayer[], players: IPlayer[]) => void
    lockState: LockState
}

interface IPlayersForm {
    players: PlayerFormItem[]
}

const PlayerForm = ({ players, callback, lockState }: PlayersForm) => {
    console.log('PLAYERS: ', players)
    const teamContext = useContext(TeamContext)
    const { team } = teamContext
    const toast = useToast({ duration: 1000, position: 'top-right' })

    const methods = useForm<IPlayersForm>({
        mode: 'onTouched',
        resolver: yupResolver(playerFormSchema),
    })

    const {
        formState: { isValid, dirtyFields },
        setValue,
        getValues,
        reset,
        setError,
    } = methods

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'captain',
        defaultValue: getDefaultCaptain(players),
        onChange: (value) => {
            const { players } = getValues()
            const idx = findWithAttr(players, 'is_captain', true)
            const [captain] = idx
            // @ts-ignore
            setValue(`${value}.is_captain`, true, {
                shouldDirty: true,
            })
            // @ts-ignore
            setValue(`players.${captain}.is_captain`, false, {
                shouldDirty: true,
            })
        },
    })

    const captainGroup = getRootProps()

    const upsertPlayer = (ref, player): Promise<TransactionResult> => {
        return new Promise((resolve) => {
            // Existing Player!
            if (player.id && player.id !== '') {
                const playerWithId = { ...player }
                if (player.uplay === '' && player.email === '') {
                    ref.collection('players')
                        .doc(playerWithId.id)
                        .delete()
                        .then(() => {
                            resolve({
                                player: playerWithId,
                                status: 'REMOVED',
                            })
                        })
                } else {
                    delete player.id
                    ref.collection('players')
                        .doc(playerWithId.id)
                        .update({
                            ...player,
                        })
                        .then(() => {
                            resolve({
                                player: playerWithId,
                                status: 'UPDATED',
                            })
                        })
                }
            } else {
                delete player.id
                ref.collection('players')
                    .add({
                        ...player,
                    })
                    .then((result) => {
                        result.get().then((data) => {
                            resolve({
                                player: {
                                    ...data.data(),
                                    id: data.id,
                                },
                                status: 'CREATED',
                            })
                        })
                    })
            }
        })
    }

    const onSubmit = (data) => {
        const doSave = true
        if (isValid && dirtyFields.players) {
            const { players: formStatePlayers } = data
            console.log(formStatePlayers)
            const validPlayers = formStatePlayers
                .map((p, i) => ({ ...p, index: i }))
                .filter((player) => !isPlayerEqual(player, players[player.index]))
                .filter((player) => player.email !== '')
                .filter((player) => typeof dirtyFields?.players[player.index] !== 'undefined')

            console.log('VALID PLAYERS: ', validPlayers)
            const removedPlayers = formStatePlayers
                .map((p, i) => ({ ...p, index: i }))
                .filter(
                    (player) =>
                        player.id !== '' &&
                        player.email === '' &&
                        player.uplay === '' &&
                        typeof dirtyFields?.players[player.index] !== 'undefined'
                )

            if (removedPlayers) {
                for (let j = 0; j < removedPlayers.length; j += 1) {
                    const removedPlayer = removedPlayers[j]
                    if (removedPlayer.is_captain) {
                        // @ts-ignore
                        setError(`players.${removedPlayer.index}.email`, {
                            type: 'manual',
                            message: 'Cannot remove team captain, please make another player team captain ',
                        })
                        return
                    }
                    if (validPlayers.filter((player) => player.index === removedPlayer.index).length === 0) {
                        validPlayers.push(removedPlayer)
                    }
                }
            }
            const playersCollection = Teams.getPlayersCollection(team.id)
            if (doSave && validPlayers.length > 0) {
                Promise.all<TransactionResult>(
                    validPlayers.map((player) => upsertPlayer(playersCollection, player))
                ).then((result: TransactionResult[]) => {
                    result.forEach((updated) => {
                        if (updated.status === 'CREATED') {
                            toast({
                                title: `Added Player ${updated.player.index + 1}`,
                                status: 'success',
                            })
                        } else if (updated.status === 'UPDATED') {
                            toast({
                                title: `Updated Player ${updated.player.index + 1}`,
                                status: 'info',
                            })
                        } else if (updated.status === 'REMOVED') {
                            toast({
                                title: `Removed Player ${updated.player.index + 1}`,
                                status: 'warning',
                            })
                        }
                    })
                    const updatedPlayers = result.map((p) => p.player)

                    const existingValues = getValues()

                    for (let i = 0; i < updatedPlayers.length; i += 1) {
                        const updated = updatedPlayers[i]
                        existingValues.players[updated.index] = {
                            ...updated,
                            required: players[updated.index].required,
                        }
                    }
                    callback(updatedPlayers, existingValues.players as unknown as IPlayer[])
                    reset(existingValues)
                })
            }
        }
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} noValidate={true}>
                    <div className="player-wrapper flex flex-col max-w-7xl mx-auto items-center" {...captainGroup}>
                        {lockState.locked && <div className="text-error font-medium text-sm">{lockState.message}</div>}
                        <div className="text-right max-w-3xl w-full">
                            <div className="space-x-4">
                                <Button
                                    colorScheme="green"
                                    type="submit"
                                    isDisabled={!(isValid && !!dirtyFields.players) || lockState.locked}
                                >
                                    Save
                                </Button>
                            </div>
                            <div className="font-normal text-red-400 pt-2" />
                        </div>
                        {players.map((player, idx) => {
                            return (
                                <Player
                                    locked={lockState.locked}
                                    order={idx}
                                    key={`player-${idx}`}
                                    player={player}
                                    captainRadioProps={getRadioProps({ value: `players.${idx}` })}
                                />
                            )
                        })}
                        <div className="text-right max-w-3xl w-full">
                            <div className="space-x-4">
                                <Button
                                    colorScheme="green"
                                    type="submit"
                                    isDisabled={!(isValid && !!dirtyFields.players) || lockState.locked}
                                >
                                    Save
                                </Button>
                            </div>
                            <div className="font-normal text-red-400 pt-2" />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default PlayerForm
