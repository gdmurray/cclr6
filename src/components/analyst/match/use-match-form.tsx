import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@chakra-ui/react'
import { ITeam } from '@lib/models/team'

export const playerStats = yup.object().shape({
    player_id: yup.string().nullable(),
    player_name: yup.string(),
    rating: yup.number().positive(),
    kills: yup.number().integer(),
    deaths: yup.number().integer(),
    kill_differential: yup.number().integer(),
    kd_ratio: yup.number(),
    opening_kills: yup.number(),
    opening_deaths: yup.number(),
    entry_differential: yup.number(),
    kills_per_round: yup.number().default(0.0),
    survivability: yup.string(),
    kost: yup.string(),
    oneVX: yup.mixed().nullable(),
    plants: yup.mixed().nullable(),
    disables: yup.mixed().nullable(),
})

export type PlayerStats = yup.InferType<typeof playerStats>

const matchStatsSchema = yup.object().shape({
    id: yup.string().nullable(),
    match_id: yup.string(),
    match_date: yup.string(),
    team_one_id: yup.string(),
    team_two_id: yup.string(),
    maps: yup.array().of(
        yup.object().shape({
            map_name: yup.string().optional(),
            team_one_score: yup.number(),
            team_two_score: yup.number(),
            team_one_players: yup.array().of(playerStats),
            team_two_players: yup.array().of(playerStats),
        })
    ),
})

export type MatchStatsSchema = yup.InferType<typeof matchStatsSchema>

export type PlayerStatsForm = {
    player_id: string
    player_name: string
    rating: number
    kills: number
    deaths: number
    kill_differential: number
    kd_ratio: number
    opening_kills: number
    opening_deaths: number
    entry_differential: number
    kills_per_round: number
    survivability: any
    kost: any
    oneVX: any
    plants: any
    disables: any
}

export type MapStatsForm = {
    map_name: string
    team_one_score: number
    team_two_score: number
    team_one_players: PlayerStatsForm[]
    team_two_players: PlayerStatsForm[]
}
export type MatchStatsForm = {
    id?: string
    match_id: string
    match_date: string
    team_one_id: string
    team_two_id: string
    maps: MapStatsForm[]
}

export type TeamData = {
    score: string
    players: PlayerStats[]
    team: ITeam
}

export function useMatchForm(defaultValues: Partial<MatchStatsForm>) {
    const toast = useToast({ variant: 'solid', duration: 3000 })
    const methods = useForm<MatchStatsForm>({
        defaultValues,
        resolver: yupResolver(matchStatsSchema),
    })

    console.log(methods.formState.errors)

    function onSubmit(values) {
        fetch('/api/analyst/update', {
            method: 'POST',
            body: JSON.stringify({
                stats: values,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                toast({
                    title: 'Successfully saved stats',
                    status: 'info',
                })
                response.json().then((result) => {
                    const { id } = result
                    syncWithSheets(id)
                })
            } else {
                toast({
                    title: 'There was an error saving stats',
                    status: 'error',
                })
            }
        })
    }

    function syncWithSheets(id: string) {
        fetch('/api/analyst/sync', {
            method: 'POST',
            body: JSON.stringify({
                id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                toast({
                    status: 'success',
                    title: 'Synced data with stat sheet',
                })
            } else {
                toast({
                    title: 'There was an error syncing stats with sheet ',
                    status: 'error',
                })
            }
            console.log('Sync Result: ', response)
        })
    }

    return {
        methods,
        onSubmit,
        syncWithSheets,
    }
}
