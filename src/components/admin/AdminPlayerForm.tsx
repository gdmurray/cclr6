import { PlayerFormItem } from '@components/teams/players/Form'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, useRadioGroup } from '@chakra-ui/react'
import { findWithAttr, isPlayerEqual } from '@lib/utils'
import Player from '@components/teams/players/Player'
import React from 'react'
import { ITeam } from '@lib/models/team'
import { useRouter } from 'next/router'
import { getDefaultCaptain, playerFormSchema } from '@lib/playerform'

interface PlayersForm {
    players: PlayerFormItem[]
}

export default function AdminPlayerForm({ team, players }: { team: ITeam; players: PlayerFormItem[] }) {
    console.log('PLAYERS: ', players)
    const methods = useForm<PlayersForm>({
        mode: 'onTouched',
        resolver: yupResolver(playerFormSchema),
    })

    const router = useRouter()

    const {
        formState: { isValid, dirtyFields },
        setValue,
        getValues,
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

    const onSubmit = (data) => {
        const doSave = true
        if (isValid && dirtyFields.players) {
            const { players: formStatePlayers } = data
            console.log('PLAYERS: ', formStatePlayers)
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

            if (doSave && validPlayers.length > 0) {
                fetch('/api/admin/team/players/update', {
                    method: 'PUT',
                    body: JSON.stringify({
                        team_id: team.id,
                        players: validPlayers,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => {
                    if (res.ok) {
                        router.reload()
                    }
                })
            }
        }
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} noValidate={true}>
                    <div className="player-wrapper flex flex-col max-w-7xl mx-auto items-center" {...captainGroup}>
                        <div className="text-right max-w-3xl w-full">
                            <div className="space-x-4">
                                <Button
                                    colorScheme="green"
                                    type="submit"
                                    isDisabled={!(isValid && !!dirtyFields.players)}
                                >
                                    Save
                                </Button>
                            </div>
                            <div className="font-normal text-red-400 pt-2" />
                        </div>
                        {players.map((player, idx) => {
                            return (
                                <Player
                                    locked={false}
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
                                    isDisabled={!(isValid && !!dirtyFields.players)}
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
