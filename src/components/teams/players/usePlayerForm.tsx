import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRadioGroup, useToast } from '@chakra-ui/react'
import { findWithAttr, isPlayerEqual, omit } from '@lib/utils'
import * as yup from 'yup'
import { IPlayer } from '@lib/models/player'
import React from 'react'
import { OnDragEndResponder } from 'react-beautiful-dnd'

export interface PlayerFormItem {
    id?: string
    email: string
    uplay: string
    index: number
    is_captain: boolean
    country: string
    required: boolean
    setCountryValue?: React.Dispatch<React.SetStateAction<string>>
    twitter?: string
    twitch?: string
}

interface IPlayersForm {
    players: PlayerFormItem[]
}

yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
    return this.test('unique', message, function (list) {
        const listWithValues = list.map(mapper).filter((val) => val != '')
        if (listWithValues.length > 0) {
            const counts = listWithValues.reduce((acc: Record<string, number>, val: string, _idx) => {
                if (!(val in acc)) {
                    acc[val] = 1
                } else {
                    acc[val] += 1
                }
                return acc
            }, {})
            const indexes = Object.keys(counts)
                .filter((key) => counts[key] > 1)
                .reduce((acc: number[][], val: string) => {
                    const values = findWithAttr(list, 'email', val)
                    acc.push(values)
                    return acc
                }, [])
            if (indexes.length > 0) {
                const [idx] = indexes

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_idx, errorIndex] = idx
                return this.createError({
                    path: `players.${errorIndex}.email`,
                    message: 'Cannot use the same email address',
                })
            }
        }
        return true
    })
})

const playerFormSchema = yup.object().shape({
    players: yup
        .array()
        .of(
            yup.object().shape({
                email: yup.string().email('Must be a Valid Email'),
                uplay: yup.string().when('email', {
                    is: (email) => email !== '' && email.length > 0,
                    then: yup
                        .string()
                        .required('Must include players Uplay')
                        .min(1, "Player's Uplay must be longer than 1 character")
                        .max(16, "Player's Uplay must be shorter than 16 characters"),
                }),
                twitter: yup.string().max(15, 'Twitter handle cannot be longer than 15 characters'),
                twitch: yup.string().max(15, 'Twitter handle cannot be longer than 15 characters'),
                is_captain: yup.boolean(),
            })
        )
        .unique('duplicate email', (a) => a.email),
})

export function getDefaultCaptain(players: PlayerFormItem[]): string {
    const defaultCaptain = 'players.0'
    for (let i = 0; i < players.length; i += 1) {
        if (players[i].is_captain) {
            return `players.${i}`
        }
    }
    return defaultCaptain
}

export interface TransactionResult {
    player: IPlayer
    status: 'CREATED' | 'UPDATED' | 'REMOVED'
}

export function usePlayerForm({ players }: { players: PlayerFormItem[] }) {
    const toast = useToast({ duration: 2000, position: 'top-right', variant: 'solid' })
    const methods = useForm<IPlayersForm>({
        mode: 'onTouched',
        // @ts-ignore
        resolver: yupResolver(playerFormSchema),
    })

    const {
        formState: { dirtyFields },
        getValues,
        setValue,
        setError,
    } = methods

    const {
        getRootProps,
        getRadioProps,
        setValue: setCaptainValue,
    } = useRadioGroup({
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

    const onDragEnd: OnDragEndResponder = (result) => {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const formValues = getValues()

        const sourceValue = { ...formValues.players[result.source.index] }
        const destValue = { ...formValues.players[result.destination.index] }

        setValue(
            `players.${result.destination.index}`,
            {
                ...sourceValue,
                id: destValue.id,
                setCountryValue: undefined, //destValue.setCountryValue,
            },
            {
                shouldDirty: true,
            }
        )

        setValue(
            `players.${result.source.index}`,
            {
                ...destValue,
                id: sourceValue.id,
                setCountryValue: undefined, // sourceValue.setCountryValue,
            },
            { shouldDirty: true }
        )

        if (sourceValue.country !== destValue.country) {
            // @ts-ignore
            sourceValue.setCountryValue(destValue.country)
            // @ts-ignore
            destValue.setCountryValue(sourceValue.country)
        }

        if (sourceValue.is_captain) {
            setCaptainValue(`players.${result.destination.index}`)
        } else if (destValue.is_captain) {
            setCaptainValue(`players.${result.source.index}`)
        }

        const updatedPlayers = getValues()
        const invalidCaptains = updatedPlayers.players
            .map((player, idx) => ({ index: idx, ...player }))
            .filter((player, idx) => {
                return idx > 4 && player.is_captain
            })
        if (invalidCaptains.length > 0) {
            const [invalidCaptain] = invalidCaptains
            setCaptainValue(`players.0`)
            setValue(`players.0.is_captain`, true)
            setValue(`players.${invalidCaptain.index}.is_captain`, false)
            toast({
                title: 'Team Captain cannot be a substitute, first player set as captain.',
                status: 'warning',
            })
        }
    }

    function getValidPlayers(formItems: PlayerFormItem[]): PlayerFormItem[] {
        const validPlayers = formItems
            .map((p, i) => ({ ...p, index: i }))
            .filter((player) => !isPlayerEqual(player, players[player.index]))
            .filter((player) => player.email !== '')
            .filter((player) => typeof dirtyFields?.players[player.index] !== 'undefined')
            .map((player) => omit<PlayerFormItem>(player, 'setCountryValue'))

        const removedPlayers = formItems
            .map((p, i) => ({ ...p, index: i }))
            .filter(
                (player) =>
                    player.id !== '' &&
                    player.email === '' &&
                    player.uplay === '' &&
                    typeof dirtyFields?.players[player.index] !== 'undefined'
            )
            .map((player) => omit<PlayerFormItem>(player, 'setCountryValue'))

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
        return validPlayers as PlayerFormItem[]
    }

    const captainGroup = getRootProps()
    return {
        methods,
        captainGroup,
        setCaptainValue,
        getRadioProps,
        getValidPlayers,
        onDragEnd,
    }
}
