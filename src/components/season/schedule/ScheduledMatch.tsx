import React from 'react'
import { MatchWithDate } from '@lib/season/common'
import { ITeam } from '@lib/models/team'
import { Box, Image, useColorMode } from '@chakra-ui/react'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import dayjs from 'dayjs'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advancedFormat)

import { getHostName } from '@lib/utils'

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

function TeamScheduleDetail({ team, match }: { team: ITeam; match: MatchWithDate }): JSX.Element {
    const { colorMode } = useColorMode()
    if (match.report_closed) {
        const teamResult = match.opponents.filter((elem) => elem.participant.custom_user_identifier === team.id)[0]
        return (
            <Box width={{ base: 100, sm: 120 }} height={{ base: 120, sm: 140 }}>
                <div className="schedule-score-overlay">{teamResult.score}</div>
                <Image
                    className="mx-auto schedule-logo-overlay"
                    src={team?.logo}
                    fallbackSrc={`${getHostName()}/images/${
                        colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                    }`}
                    width={{ base: 75, sm: 100 }}
                    height={{ base: 75, sm: 100 }}
                />
                <div className="text-main text-center font-medium text-sm">{team?.name}</div>
            </Box>
        )
    }
    return (
        <Box width={{ base: 100, sm: 120 }} height={{ base: 120, sm: 140 }}>
            <Image
                className="mx-auto"
                src={team?.logo}
                fallbackSrc={`${getHostName()}/images/${
                    colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                }`}
                width={{ base: 75, sm: 100 }}
                height={{ base: 75, sm: 100 }}
            />
            <div className="text-main text-center font-medium text-sm">{team?.name}</div>
        </Box>
    )
}

export default function ScheduledMatch({ match, teams }: ScheduledMatchProps): JSX.Element {
    const [team1, team2] = match.opponents

    function getMatchDate(match: MatchWithDate) {
        if (match.scheduled_datetime == null) {
            return match.match_date
        }
        return match.scheduled_datetime
    }

    return (
        <div className="flex flex-row">
            <div className="w-3/12 flex flex-col justify-center text-main font-heavy text-2xl sm:text-3xl font-medium uppercase pb-6 text-center">
                <span className="flex justify-center md:hidden text-xl sm:text-2xl">
                    {/* Long Form Saturday */}
                    <Box as="span" display={{ base: 'none', sm: 'block' }}>
                        {dayjs(getMatchDate(match)).format('dddd')}
                    </Box>
                    {/* Short Form Saturday */}
                    <Box as="span" display={{ base: 'block', sm: 'none' }}>
                        {dayjs(getMatchDate(match)).format('ddd')}
                    </Box>
                </span>
                <span>
                    {dayjs(getMatchDate(match)).format('MMM')}{' '}
                    <span className="text-primary">{dayjs(getMatchDate(match)).format('D')}</span>
                </span>
            </div>
            <div className="flex flex-row w-full justify-evenly">
                <TeamScheduleDetail team={teams[team1.participant.custom_user_identifier]} match={match} />
                <div className="flex flex-col justify-center text-center">
                    <div
                        className="font-heavy text-3xl sm:text-4xl text-main font-semibold"
                        style={{ lineHeight: '0.6em' }}
                    >
                        VS
                    </div>
                    <div className="font-heavy text-xl sm:text-2xl text-main font-medium pb-6">
                        {dayjs(getMatchDate(match)).format('hA')}
                        <span className="text-primary">{ignoreDaylight(dayjs(getMatchDate(match)).format('z'))}</span>
                    </div>
                </div>
                <TeamScheduleDetail team={teams[team2.participant.custom_user_identifier]} match={match} />
            </div>
        </div>
    )
}
