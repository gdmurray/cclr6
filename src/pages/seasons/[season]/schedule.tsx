import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getCurrentSeason, getSeasonPaths, MatchWithDate } from '@lib/season/common'
import { ToornamentClient } from '@lib/api/toornament'
import { getMatchData } from '@lib/season/api'
import { ITeam, Teams } from '@lib/models/team'
import { Box, Image, useColorMode } from '@chakra-ui/react'
import { getHostName } from '@lib/utils'
import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const currentSeason = getCurrentSeason(params)
    const client = new ToornamentClient()

    const matches = await client.getMatches(currentSeason.TOURNAMENT_ID)
    const matchData = await getMatchData(matches, currentSeason)

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
        revalidate: 3600,
    }
}

interface ScheduledMatchProps {
    match: MatchWithDate
    teams: ITeam[]
}

function ignoreDaylight(tz_string: string): string {
    const DATE_REGEX = /(?=[^])D(?=[^])/i
    if (DATE_REGEX.test(tz_string)) {
        return tz_string.replace(DATE_REGEX, 'S')
    }
    return tz_string
}

function ScheduledMatch({ match, teams }: ScheduledMatchProps): JSX.Element {
    const [team1, team2] = match.opponents

    const { colorMode } = useColorMode()

    return (
        <div className="flex flex-row">
            <div className="w-3/12 flex flex-col justify-center text-main font-heavy text-2xl sm:text-3xl font-medium uppercase pb-6 text-center">
                <span className="flex justify-center md:hidden text-xl sm:text-2xl">
                    {/* Long Form Saturday */}
                    <Box as="span" display={{ base: 'none', sm: 'block' }}>
                        {dayjs(match.match_date).format('dddd')}
                    </Box>
                    {/* Short Form Saturday */}
                    <Box as="span" display={{ base: 'block', sm: 'none' }}>
                        {dayjs(match.match_date).format('ddd')}
                    </Box>
                </span>
                <span>
                    {dayjs(match.match_date).format('MMM')}{' '}
                    <span className="text-primary">{dayjs(match.match_date).format('D')}</span>
                </span>
            </div>
            <div className="flex flex-row w-full justify-evenly">
                <Box width={{ base: 100, sm: 120 }} height={{ base: 120, sm: 140 }}>
                    <Image
                        className="mx-auto"
                        src={teams[team1.participant.custom_user_identifier].logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                        width={{ base: 75, sm: 100 }}
                        height={{ base: 75, sm: 100 }}
                    />
                    <div className="text-main text-center font-medium text-sm">{team1.participant.name}</div>
                </Box>
                <div className="flex flex-col justify-center text-center">
                    <div
                        className="font-heavy text-3xl sm:text-4xl text-main font-semibold"
                        style={{ lineHeight: '0.6em' }}
                    >
                        VS
                    </div>
                    <div className="font-heavy text-xl sm:text-2xl text-main font-medium pb-6">
                        {dayjs(match.match_date).format('hA')}
                        <span className="text-primary">{ignoreDaylight(dayjs(match.match_date).format('z'))}</span>
                    </div>
                </div>
                <Box width={{ base: 100, sm: 120 }}>
                    <Image
                        className="mx-auto"
                        src={teams[team2.participant.custom_user_identifier].logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                        width={{ base: 75, sm: 100 }}
                        height={{ base: 75, sm: 100 }}
                    />
                    <div className="text-main text-center font-medium text-sm">{team2.participant.name}</div>
                </Box>
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
            <div className="hidden md:flex flex-row space-x-6 justify-evenly">
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
            {(data ? data : []).map((week, weekNumber) => {
                return (
                    <>
                        <div className="flex md:hidden justify-center pt-12 pb-4">
                            <span className="text-main uppercase font-heavy text-3xl font-semibold">
                                Week <span className="text-primary">{weekNumber + 1}</span>
                            </span>
                        </div>
                        <div
                            key={`week-${weekNumber}`}
                            className="flex flex-col justify-center md:flex-row space-y-4 md:space-y-0 md:space-x-6 md:justify-evenly"
                        >
                            <div className="mx-auto md:mx-0 w-full max-w-lg space-y-4 md:space-y-10 pt-2 md:pt-12">
                                {week.matches
                                    .filter((_, idx) => idx < 2)
                                    .map((matchData) => {
                                        return <ScheduledMatch key={matchData.id} match={matchData} teams={teams} />
                                    })}
                                <Box as="hr" width={{ base: '80%', md: '100%' }} marginX={{ base: 'auto', md: '0' }} />
                            </div>
                            <div className="mx-auto md:mx-0 w-full max-w-lg space-y-4 md:space-y-10 pt-2 md:pt-12">
                                {week.matches
                                    .filter((_, idx) => idx > 1)
                                    .map((matchData) => {
                                        return <ScheduledMatch key={matchData.id} match={matchData} teams={teams} />
                                    })}
                                <hr />
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

SeasonOneSchedule.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonOneSchedule

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    return {
        paths: getSeasonPaths('schedule'),
        fallback: true,
    }
}
