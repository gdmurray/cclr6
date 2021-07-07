import * as yup from 'yup'
import { findWithAttr } from '@lib/utils'
import { PlayerFormItem } from '@components/teams/players/Form'
import { IPlayer } from '@lib/models/player'

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

export const playerFormSchema = yup.object().shape({
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
