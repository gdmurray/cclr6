import React, { useContext, useState } from 'react'
import { TeamContext } from '@components/teams/teamContext'
import { Teams } from '@lib/models/team'
import { IPlayer } from '@lib/models/player'
import { FormProvider } from 'react-hook-form'
import { Button, useToast } from '@chakra-ui/react'
import Player from '@components/teams/players/Player'
import { LockState } from '../../../pages/team/players'
import { PlayerFormItem, TransactionResult, usePlayerForm } from '@components/teams/players/usePlayerForm'
import { upsertPlayer } from '@lib/api/upsertPlayer'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

interface PlayersForm {
    players: PlayerFormItem[]
    callback: (updatedPlayers: IPlayer[], players: IPlayer[]) => void
    lockState: LockState
}

const PlayerForm = ({ players, callback, lockState }: PlayersForm) => {
    const teamContext = useContext(TeamContext)
    const { team } = teamContext
    const toast = useToast({ duration: 2500, position: 'top-right', variant: 'solid' })

    const { methods, captainGroup, getRadioProps, getValidPlayers, onDragEnd } = usePlayerForm({ players })

    const {
        formState: { isValid, dirtyFields },
        getValues,
        reset,
    } = methods

    const onSubmit = async ({ players: formStatePlayers }) => {
        const doSave = true
        if (isValid && dirtyFields.players) {
            const validPlayers = getValidPlayers(formStatePlayers)

            const playersCollection = Teams.getPlayersCollection(team.id)
            if (doSave && validPlayers.length > 0) {
                const results = await Promise.all<TransactionResult>(
                    validPlayers.map((player) => upsertPlayer(playersCollection, player))
                )
                for (const updated of results) {
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
                }
                const updatedPlayers = results.map((p) => p.player)

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
                // Promise.all<TransactionResult>(
                //     validPlayers.map((player) => upsertPlayer(playersCollection, player))
                // ).then((result: TransactionResult[]) => {
                //     result.forEach((updated) => {
                //         if (updated.status === 'CREATED') {
                //             toast({
                //                 title: `Added Player ${updated.player.index + 1}`,
                //                 status: 'success',
                //             })
                //         } else if (updated.status === 'UPDATED') {
                //             toast({
                //                 title: `Updated Player ${updated.player.index + 1}`,
                //                 status: 'info',
                //             })
                //         } else if (updated.status === 'REMOVED') {
                //             toast({
                //                 title: `Removed Player ${updated.player.index + 1}`,
                //                 status: 'warning',
                //             })
                //         }
                //     })
                //     const updatedPlayers = result.map((p) => p.player)
                //
                //     const existingValues = getValues()
                //
                //     for (let i = 0; i < updatedPlayers.length; i += 1) {
                //         const updated = updatedPlayers[i]
                //         existingValues.players[updated.index] = {
                //             ...updated,
                //             required: players[updated.index].required,
                //         }
                //     }
                //     callback(updatedPlayers, existingValues.players as unknown as IPlayer[])
                //     reset(existingValues)
                // })
            }
        }
    }

    console.log('isValid: ', isValid)
    console.log('Dirtyfields: ', dirtyFields.players)
    console.log('locked: ', lockState.locked)
    const saveDisabled = !(isValid && !!dirtyFields.players) || lockState.locked
    console.log('Save Disabled: ', saveDisabled)

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} noValidate={true}>
                        <div className="player-wrapper flex flex-col max-w-7xl mx-auto items-center" {...captainGroup}>
                            {lockState.locked && (
                                <div className="text-error font-medium text-sm">{lockState.message}</div>
                            )}
                            <div className="text-right max-w-3xl w-full">
                                <div className="space-x-4">
                                    <Button colorScheme="green" type="submit" isDisabled={saveDisabled}>
                                        Save
                                    </Button>
                                </div>
                                <div className="font-normal text-red-400 pt-2" />
                            </div>
                            <Droppable droppableId="playerList">
                                {(provided) => (
                                    <div
                                        className="space-y-4 w-auto w-full"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
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
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            <div className="text-right max-w-3xl w-full">
                                <div className="space-x-4 pt-2">
                                    <Button colorScheme="green" type="submit" isDisabled={saveDisabled}>
                                        Save
                                    </Button>
                                </div>
                                <div className="font-normal text-red-400 pt-2" />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </DragDropContext>
        </div>
    )
}

export default PlayerForm
