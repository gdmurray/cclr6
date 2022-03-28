import { ITeam } from '@lib/models/team'
import { useFormContext } from 'react-hook-form'
import { usePapaParse } from 'react-papaparse'
import React, { useEffect, useState } from 'react'
import { Button, Input, Select } from '@chakra-ui/react'
import { headerValues, TeamTable } from '@components/analyst/match/TeamTable'
import { similarity } from '@components/analyst/match/utils'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { MapList } from '@lib/maps'
import { TeamData } from '@components/analyst/match/use-match-form'
import { UseFieldArrayRemove } from 'react-hook-form/dist/types/fieldArray'
import { FaTimes } from 'react-icons/fa'

export const MapStats = ({
    index,
    teamOne,
    teamTwo,
    teamPlayerMap,
    onRemove,
}: {
    index: number
    teamOne: ITeam
    teamTwo: ITeam
    teamPlayerMap: Record<string, Record<string, string>>
    onRemove: UseFieldArrayRemove
}): JSX.Element => {
    const { watch, register } = useFormContext()
    const previousMatchData = watch(`maps.${index}`)

    const { readString } = usePapaParse()
    const [csvData, setCSVData] = useState<string[][]>()
    const [teamData, setTeamData] = useState<TeamData[]>()

    useEffect(() => {
        if (previousMatchData != null && Object.keys(previousMatchData).length > 3 && !teamData) {
            console.log('SETTING DEFAULT TEAM DATA: ', previousMatchData)
            setTeamData([
                {
                    score: previousMatchData.team_one_score,
                    players: previousMatchData.team_one_players,
                    team: teamOne,
                },
                {
                    score: previousMatchData.team_two_score,
                    players: previousMatchData.team_two_players,
                    team: teamTwo,
                },
            ])
        }
    }, [previousMatchData, teamData])

    const onUpload = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = e.target.result
                readString<string[]>(text as string, {
                    worker: true,
                    complete(results) {
                        if (results.errors.length === 0) {
                            setCSVData(results.data)
                        }
                    },
                })
            }
            reader.readAsText(file)
        }
    }

    // TODO: be smart about it
    function processCSV(csv: string[][]) {
        const rows = csv.slice(0, 12)
        const teamOneName = rows[1][0]
        const teamOneScore = rows[1].slice(-1)[0]
        const teamTwoScore = rows[6].slice(-1)[0]
        const teamOnePlayerStats = []
        const teamTwoPlayerStats = []

        for (let rowIndex = 1; rowIndex < 6; rowIndex += 1) {
            teamOnePlayerStats.push(
                headerValues.reduce((acc, label, columnIndex) => {
                    acc[label] = rows[rowIndex][columnIndex + 1]
                    return acc
                }, {})
            )
        }
        for (let rowIndex = 6; rowIndex < 11; rowIndex += 1) {
            teamTwoPlayerStats.push(
                headerValues.reduce((acc, label, columnIndex) => {
                    acc[label] = rows[rowIndex][columnIndex + 1]
                    return acc
                }, {})
            )
        }

        const teamOneData = {
            score: teamOneScore,
            players: teamOnePlayerStats,
            team: teamOne,
        }
        const teamTwoData = {
            score: teamTwoScore,
            players: teamTwoPlayerStats,
            team: teamTwo,
        }

        if (teamOneName == teamOne.name || similarity(teamOneName, teamOne.name) > 0.85) {
            setTeamData([teamOneData, teamTwoData])
        } else {
            setTeamData([teamTwoData, teamOneData])
        }
    }

    useEffect(() => {
        if (csvData) {
            processCSV(csvData)
        }
    }, [csvData])

    console.log('Team Data: ', teamData)
    return (
        <div
            className={
                'bordered dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm border rounded-xl cursor-pointer p-4'
            }
        >
            <div className="flex flex-row justify-between">
                <div className="text-subtitle">Map {index + 1}</div>
                <Button size="sm" onClick={() => onRemove(index)} leftIcon={<FaTimes className={'text-error'} />} />
            </div>
            <div className={'py-4 flex flex-row space-x-6'}>
                <div className={'max-w-sm'}>
                    <FormControl>
                        <FormLabel>Match Data CSV</FormLabel>
                        <Input pt={'4px'} w={300} size={'md'} type={'file'} onChange={onUpload} />
                    </FormControl>
                </div>
                <div>
                    <FormControl isRequired={true}>
                        <FormLabel>Map Name</FormLabel>
                        <Select {...register(`maps.${index}.map_name`)} w={300}>
                            {MapList.map((name) => (
                                <option key={`${index}-${name}`} value={name}>
                                    {name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div>
                {teamData &&
                    teamData.length == 2 &&
                    teamData.map((teamData, team_index) => (
                        <TeamTable
                            key={`${index}-${teamData.team.id}`}
                            map_index={index}
                            team_key={team_index === 0 ? 'one' : 'two'}
                            data={teamData}
                            playerMap={teamPlayerMap[teamData.team.id]}
                        />
                    ))}
            </div>
        </div>
    )
}
