import { useFormContext } from 'react-hook-form'
import { Input, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { PlayerRow } from '@components/analyst/match/PlayerRow'
import { TeamData } from './use-match-form'
import numeral from 'numeral'

numeral.options.scalePercentBy100 = false

export const headerValues = [
    'player_name',
    'rating',
    'kills',
    'deaths',
    'kill_differential',
    'kd_ratio',
    'opening_kills',
    'opening_deaths',
    'entry_differential',
    'kills_per_round',
    'survivability',
    'kost',
    'oneVX',
    'plants',
    'disables',
]

export const mappedHeaders = {
    player: 'Player',
    player_name: 'Uplay',
    rating: 'Rating',
    kills: 'Kills',
    deaths: 'Deaths',
    kill_differential: '+/-',
    kd_ratio: 'K/D Ratio',
    opening_kills: 'OK',
    opening_deaths: 'OD',
    entry_differential: 'Entry +/-',
    kills_per_round: 'KPR',
    survivability: 'SRV',
    kost: 'KOST',
    oneVX: '1vX',
    plants: 'Plant',
    disables: 'Disable',
}

export const statsValueFormatter: Record<string, (value: string | number) => string> = {
    player_name: (value): string => (value as string).toUpperCase(),
    rating: (value) => numeral(value).format('0.00'),
    kill_differential: (value) => numeral(value).format('+0'),
    kd_ratio: (value) => numeral(value).format('0.00'),
    entry_differential: (value) => numeral(value).format('+0'),
    kills_per_round: (value) => numeral(value).format('0.00'),
    survivability: (value) => numeral(typeof value === 'string' ? value.replace('%', '') : value).format('0%'),
    kost: (value) => numeral(typeof value === 'string' ? value.replace('%', '') : value).format('0%'),
}

export function formatStatsValue(key: string, value: string) {
    if (key in statsValueFormatter) {
        return `'${statsValueFormatter[key](value)}`
    }
    return value
}

export const tableHeaders = ['player'].concat(headerValues)

export const TeamTable = ({
    map_index,
    data,
    team_key,
    playerMap,
}: {
    map_index: number
    data: TeamData
    playerMap: Record<string, string>
    team_key: string
}): JSX.Element => {
    const { register } = useFormContext()

    return (
        <div className={'pt-4'}>
            <div className={'text-main text-lg font-medium flex flex-row nowrap'}>
                {data.team.name} -{' '}
                <Input
                    size={'sm'}
                    style={{ maxWidth: '30px', paddingLeft: '7px', fontSize: '24px' }}
                    variant={'flushed'}
                    {...register(`maps.${map_index}.team_${team_key}_score`)}
                    defaultValue={data.score}
                />
            </div>
            <Table variant={'simple'} size={'sm'}>
                <Thead>
                    <Tr>
                        {tableHeaders.map((header_name) => {
                            return <Th key={header_name}>{mappedHeaders[header_name]}</Th>
                        })}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.players.map((playerData, index) => {
                        return (
                            <PlayerRow
                                key={`${map_index}-${data.team.id}-${team_key}-${index}`}
                                team={data.team}
                                data={playerData}
                                map_index={map_index}
                                team_key={team_key}
                                player_index={index}
                                playerMap={playerMap}
                            />
                        )
                    })}
                </Tbody>
            </Table>
        </div>
    )
}
