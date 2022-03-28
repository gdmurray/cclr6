import React, { useContext } from 'react'
import SeasonLayout, { SeasonContext, useSeason } from '@components/season/SeasonLayout'
import { getSeasonPaths, getCurrentSeason, MatchWithDate } from '@lib/season/common'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { ITeam, Teams } from '@lib/models/team'
import { ToornamentClient } from '@lib/api/toornament'
import { getMatchData } from '@lib/season/api'
import ScheduledMatch from '@components/season/schedule/ScheduledMatch'
import { Box } from '@chakra-ui/react'
import { Match } from '@lib/models/toornament'

interface SeasonScheduleProps {
    data?: Record<any, any>[]
    teams?: ITeam[]
    seasonKey: string
}

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

export const SeasonSchedule = ({ data, teams }: SeasonScheduleProps): JSX.Element => {
    const season = useSeason()
    const matchReducer = (acc: Record<number, Match[]>, elem: Match) => {
        if (elem.number in acc) {
            acc[elem.number].push(elem)
        } else {
            acc[elem.number] = [elem]
        }
        return acc
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="hidden lg:flex flex-row space-x-6 justify-evenly">
                {season.MATCH_DAYS.map((day) => {
                    return (
                        <div key={day} className="w-full max-w-sm">
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
            {Object.values((data ? data : []).reduce(matchReducer, {})).map((week, weekNumber) => {
                const weekData = season.WEEK_FORMATTER(week)
                return (
                    <React.Fragment key={`week-${weekNumber}`}>
                        <div className="flex lg:hidden justify-center pt-12 pb-4">
                            <span className="text-main uppercase font-heavy text-3xl font-semibold">
                                Week <span className="text-primary">{weekNumber + 1}</span>
                            </span>
                        </div>
                        <div
                            key={`week-${weekNumber}`}
                            className="flex flex-col justify-center lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 lg:justify-evenly"
                        >
                            {weekData.map((matchDay, dayNumber) => (
                                <div
                                    key={`match-${dayNumber}-${weekNumber}`}
                                    className="mx-auto lg:mx-0 w-full max-w-sm space-y-4 lg:space-y-10 pt-2 lg:pt-12"
                                >
                                    {matchDay.map((match) => {
                                        return (
                                            <ScheduledMatch
                                                key={match.id}
                                                match={match as MatchWithDate}
                                                teams={teams}
                                            />
                                        )
                                    })}
                                    <Box
                                        as="hr"
                                        width={{ base: '80%', lg: '100%' }}
                                        marginX={{ base: 'auto', lg: '0' }}
                                    />
                                </div>
                            ))}
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
    const paths = getSeasonPaths('schedule')
    return {
        paths: paths,
        fallback: true,
    }
}
