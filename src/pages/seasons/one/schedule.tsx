import React from 'react'
import SeasonLayout from '@components/season/layout'
import { ToornamentClient } from '@lib/api/toornament'
import CustomParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { Image, useColorMode } from '@chakra-ui/react'
import { ITeam, Teams } from '@lib/models/team'
import { getHostName } from '@lib/utils'
import { getMatchData, SeasonOne } from '@lib/season'

dayjs.extend(CustomParseFormat)

export const getServerSideProps = async () => {
    const tournament_id = '4585711997166354432'

    const client = new ToornamentClient()
    const matches = await client.getMatches(tournament_id)
    const matchData = await getMatchData(matches, SeasonOne.BASE_MATCH)

    const teamData = await Teams.getTeams()
    const teamMap = teamData.docs.reduce((acc, elem) => {
        acc[elem.id] = {
            ...elem.data(),
        }
        return acc
    }, {})

    return {
        props: {
            data: matchData,
            teams: teamMap,
        },
    }
}

interface ScheduledMatchProps {
    day: number
    match: number
    week: number
    matchData: Record<any, any>
    teams: ITeam[]
}

function ScheduledMatch({ day, match, week, matchData, teams }: ScheduledMatchProps): JSX.Element {
    const [team1, team2] = matchData.opponents
    const first = new Date(2021, 6, 10, 14, 0, 0)
    // const first_match = dayjs('July 10, 2021 2pm -0500', 'MMMM D, YYYY ma ZZ')
    // console.log(first_match)
    const matchDate = dayjs(first)
        .add(week, 'week')
        .add(day, 'day')
        .add(match * 2, 'hour')

    const { colorMode } = useColorMode()

    return (
        <div className="flex flex-row">
            <div className="w-3/12 flex flex-col justify-center text-main font-heavy text-3xl font-medium uppercase pb-6 text-center">
                <span>
                    {matchDate.format('MMM')} <span className="text-primary">{matchDate.format('D')}</span>
                </span>
            </div>
            <div className="flex flex-row w-full justify-evenly">
                <div style={{ width: '120px', height: '140px' }}>
                    <Image
                        className="mx-auto"
                        src={teams[team1.participant.custom_user_identifier].logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                        width={100}
                        height={100}
                    />
                    <div className="text-main text-center font-medium text-sm">{team1.participant.name}</div>
                </div>
                <div className="flex flex-col justify-center text-center">
                    <div className="font-heavy text-4xl text-main font-semibold" style={{ lineHeight: '0.6em' }}>
                        VS
                    </div>
                    <div className="font-heavy text-2xl text-main font-medium pb-6">
                        {matchDate.format('hA')}
                        <span className="text-primary">EST</span>
                    </div>
                </div>
                <div style={{ width: '100px', height: '140px' }}>
                    <Image
                        className="mx-auto"
                        src={teams[team2.participant.custom_user_identifier].logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                        width={100}
                        height={100}
                    />
                    <div className="text-main text-center font-medium text-sm">{team2.participant.name}</div>
                </div>
            </div>
        </div>
    )
}

interface SeasonOneScheduleProps {
    data: Record<any, any>[]
    teams: ITeam[]
}

const SeasonOneSchedule = ({ data, teams }: SeasonOneScheduleProps): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-row space-x-6 justify-evenly">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-10">
                        <span className="text-main uppercase font-heavy text-5xl font-semibold">
                            Satur<span className="text-primary">day</span>
                        </span>
                    </div>
                    <hr />
                </div>
                <div className="w-full max-w-lg">
                    <div className="text-center mb-10">
                        <span className="text-main uppercase font-heavy text-5xl font-semibold">
                            Sun<span className="text-primary">day</span>
                        </span>
                    </div>
                    <hr />
                </div>
            </div>
            {data.map((week, weekNumber) => {
                return (
                    <div key={`week-${weekNumber}`} className="flex flex-row space-x-6 justify-evenly">
                        <div className="w-full max-w-lg space-y-10 pt-12">
                            {week.matches
                                .filter((_, idx) => idx < 2)
                                .map((matchData, idx) => {
                                    return (
                                        <ScheduledMatch
                                            key={matchData.id}
                                            day={0}
                                            week={weekNumber}
                                            match={idx}
                                            matchData={matchData}
                                            teams={teams}
                                        />
                                    )
                                })}
                            <hr />
                        </div>
                        <div className="w-full max-w-lg space-y-10 pt-12">
                            {week.matches
                                .filter((_, idx) => idx > 1)
                                .map((matchData, idx) => {
                                    return (
                                        <ScheduledMatch
                                            key={matchData.id}
                                            day={1}
                                            week={weekNumber}
                                            match={idx}
                                            matchData={matchData}
                                            teams={teams}
                                        />
                                    )
                                })}
                            <hr />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

SeasonOneSchedule.SEO = {
    url: '/seasons/one/schedule',
    title: 'Season One Schedule',
    description: 'Schedule for teams playing in Season One of Canada Contenders League',
}

SeasonOneSchedule.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={'/seasons/one'}>{content}</SeasonLayout>
}
export default SeasonOneSchedule
