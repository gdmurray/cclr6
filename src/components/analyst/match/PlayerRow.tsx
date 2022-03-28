import { ITeam } from '@lib/models/team'
import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Input, Td, Tr } from '@chakra-ui/react'
import { Select } from 'antd'
import { PlayerStats } from '@components/analyst/match/use-match-form'
import { similarity } from './utils'
import { headerValues } from '@components/analyst/match/TeamTable'

export const PlayerRow = ({
    map_index,
    team_key,
    player_index,
    playerMap,
    data,
}: {
    map_index: number
    team_key: string
    player_index: number
    playerMap: Record<string, string>
    data: PlayerStats
    team: ITeam
}): JSX.Element => {
    const { register, watch, setValue } = useFormContext()

    function attemptMappingGuess(player_name) {
        if (player_name in playerMap) {
            return playerMap[player_name]
        }
        const uplays = Object.keys(playerMap)
        if (uplays.length > 0) {
            let highestConfidence = [uplays[0], 0]
            for (let i = 1; i < uplays.length; i += 1) {
                const similar = similarity(player_name, uplays[i])
                if (similar > highestConfidence[1]) {
                    highestConfidence = [uplays[i], similar]
                }
            }
            if (highestConfidence[1] > 0.35) {
                return playerMap[highestConfidence[0]]
            }
        }
        return undefined
    }

    const options = Object.entries(playerMap).map(([uplay, id]) => ({
        label: uplay,
        value: id,
    }))

    const player_id_field = `maps.${map_index}.team_${team_key}_players.${player_index}.player_id`
    const selectValue = watch(player_id_field)

    return (
        <Tr>
            <Td>
                <Input
                    hidden={true}
                    {...register(player_id_field)}
                    defaultValue={attemptMappingGuess(data.player_name)}
                />
                <Select
                    allowClear
                    style={{ width: '120px' }}
                    defaultValue={attemptMappingGuess(data.player_name)}
                    value={selectValue}
                    onChange={(value) => {
                        setValue(player_id_field, value)
                        // todo figure out a smarter memory system
                        // const mapUpdate = { ...uplayMap, [team.id]: { ...uplayMap[team.id], [option.label]: value } }
                        // console.log('map change: ', mapUpdate)
                        // setUplayMap(mapUpdate)
                    }}
                    placeholder={'Player'}
                    options={options}
                />
            </Td>
            {headerValues.map((header) => (
                <Td paddingX={1} textAlign={'center'} key={`${map_index}-${team_key}-${header}`}>
                    <Input
                        size={'sm'}
                        paddingX={'2'}
                        variant={'flushed'}
                        {...register(`maps.${map_index}.team_${team_key}_players.${player_index}.${header}`)}
                        defaultValue={data[header]}
                        width={header === 'player_name' ? 100 : 50}
                    />
                </Td>
            ))}
        </Tr>
    )
}
