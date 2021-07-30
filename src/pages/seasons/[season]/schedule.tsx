import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getCurrentSeason, getSeasonPaths } from '@lib/season/common'
import { ToornamentClient } from '@lib/api/toornament'
import { getMatchData } from '@lib/season/api'
import { ITeam, Teams } from '@lib/models/team'
import { Box } from '@chakra-ui/react'
import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import ScheduledMatch from '@components/season/schedule/ScheduledMatch'

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
            id: elem.id,
            ...elem.data(),
        }
        return acc
    }, {})

    return {
        props: {
            data: matchData,
            teams: teamMap,
            SEO: {
                title: `${currentSeason.TITLE} Schedule `,
                image: null,
                url: `${currentSeason.BASE_URL}/schedule`,
            },
        },
        revalidate: 3600,
    }
}

interface SeasonScheduleProps {
    data: Record<any, any>[]
    teams: ITeam[]
}

const SeasonSchedule = ({ data, teams }: SeasonScheduleProps): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="hidden md:flex flex-row space-x-6 justify-evenly">
                {['Satur', 'Sun'].map((day) => {
                    return (
                        <div key={day} className="w-full max-w-lg">
                            <div className="text-center mb-10">
                                <span className="text-main uppercase font-heavy text-5xl font-semibold">
                                    {day}
                                    <span className="text-primary">day</span>
                                </span>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
            {(data ? data : []).map((week, weekNumber) => {
                return (
                    <React.Fragment key={`week-${weekNumber}`}>
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
                    </React.Fragment>
                )
            })}
        </div>
    )
}

SeasonSchedule.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonSchedule

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    return {
        paths: getSeasonPaths('schedule'),
        fallback: true,
    }
}
