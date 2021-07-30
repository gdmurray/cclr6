import { FormProvider } from 'react-hook-form'
import { Button } from '@chakra-ui/react'
import Player from '@components/teams/players/Player'
import React from 'react'
import { ITeam } from '@lib/models/team'
import { useRouter } from 'next/router'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { PlayerFormItem, usePlayerForm } from '@components/teams/players/usePlayerForm'

export default function AdminPlayerForm({ team, players }: { team: ITeam; players: PlayerFormItem[] }) {
    const router = useRouter()

    const { methods, captainGroup, getRadioProps, getValidPlayers, onDragEnd } = usePlayerForm({ players })

    const {
        formState: { isValid, dirtyFields },
    } = methods

    const onSubmit = ({ players: formStatePlayers }) => {
        const doSave = true
        if (isValid && dirtyFields.players) {
            const validPlayers = getValidPlayers(formStatePlayers)
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
            <DragDropContext onDragEnd={onDragEnd}>
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
                            <Droppable droppableId="playerList">
                                {(provided) => (
                                    <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
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
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
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
            </DragDropContext>
        </div>
    )
}
