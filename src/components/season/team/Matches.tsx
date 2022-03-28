import React, { useEffect, useState } from 'react'
import { MatchWithDate } from '@lib/season/common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ITeam } from '@lib/models/team'
import { Image, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import { Opponent } from '@lib/models/toornament'
import { getHostName } from '@lib/utils'
import { useSeason } from '@components/season/SeasonLayout'

dayjs.extend(duration)

const Timer = ({ match_date }: { match_date: string }) => {
    const [timeLeft, setTimeLeft] = useState<string>()

    useEffect(() => {
        // const _timer = setTimeout(() => {
        //     setTimeLeft(dayjs.duration(dayjs(match_date).diff(dayjs())).format('D[d] H[h] m[m] s[s]'))
        // }, 1000)
        const timer = setInterval(() => {
            setTimeLeft(dayjs.duration(dayjs(match_date).diff(dayjs())).format('D[d] H[h] m[m] s[s]'))
        }, 1000)
        return () => clearInterval(timer)
    })

    return (
        <div className="text-center font-semibold text-alt py-2">
            <span>{dayjs(match_date).format('ha [EST]')} · </span>
            <span className="text-alt-2 text-sm">Game in</span> {timeLeft}
        </div>
    )
}

function PreviousMatch({ match, teamMap }: { match: MatchWithDate; teamMap: Record<string, ITeam> }): JSX.Element {
    const [team1, team2] = match.opponents

    function getBackground(team: Opponent): string {
        if (team.score === 2) {
            return 'bg-success'
        } else if (team.score == null) {
            return 'bg-warning'
        } else {
            return 'bg-error'
        }
    }

    const teamOne = teamMap[team1.participant.custom_user_identifier]
    const teamTwo = teamMap[team2.participant.custom_user_identifier]

    const { colorMode } = useColorMode()
    const season = useSeason()
    return (
        <div>
            <div className="text-subtitle pb-1">{dayjs(match.match_date).format('dddd, MMMM D')}</div>
            <div className="flex flex-row justify-center space-x-4">
                <div className="w-full bordered items-center border rounded-lg flex flex-row text-lg sm:text-xl text-main font-semibold w-2/5 justify-end">
                    <Link href={`/seasons/${season.slug}/teams/${teamOne.slug ?? teamOne.id}`}>
                        <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                            {team1.participant.name}
                        </span>
                    </Link>
                    <Image
                        className="mx-2"
                        height={25}
                        width={25}
                        src={teamOne.logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                    />
                    <div
                        className={`p-1.5 text-center bg-success rounded-r-lg h-full flex justify-center items-center  ${getBackground(
                            team1
                        )}`}
                        style={{ minWidth: '50px', width: '50px' }}
                    >
                        <span className="font-heavy text-3xl">{team1.score}</span>
                    </div>
                </div>
                <div className="text-lg font-semibold text-center text-alt-2 w-8 self-center">vs</div>
                <div className="w-full bordered items-center border rounded-lg flex flex-row text-xl text-main font-semibold w-2/5 justify-start">
                    <div
                        className={`p-1.5 text-center bg-success rounded-l-lg h-full flex justify-center items-center ${getBackground(
                            team2
                        )}`}
                        style={{ minWidth: '50px', width: '50px' }}
                    >
                        <span className="font-heavy text-3xl">{team2.score}</span>
                    </div>
                    <Image
                        className="mx-2"
                        height={25}
                        width={25}
                        src={teamTwo.logo}
                        fallbackSrc={`${getHostName()}/images/${
                            colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                        }`}
                    />
                    <Link href={`/seasons/${season.slug}/teams/${teamTwo.slug ?? teamTwo.id}`}>
                        <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                            {team2.participant.name}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function UpcomingMatch({ match, teamMap }: { match: MatchWithDate; teamMap: Record<string, ITeam> }): JSX.Element {
    const [team1, team2] = match.opponents

    const teamOne = teamMap[team1.participant.custom_user_identifier]
    const teamTwo = teamMap[team2.participant.custom_user_identifier]
    const { colorMode } = useColorMode()
    const season = useSeason()
    return (
        <div>
            <div className="text-subtitle pb-1">{dayjs(match.match_date).format('dddd, MMMM D')}</div>
            <div>
                <div className="bordered border rounded-lg px-4 pt-4 flex flex-col">
                    <div className="flex flex-row w-full space-x-1 sm:space-x-6 justify-center ">
                        <div className="flex flex-row text-lg sm:text-xl text-main font-semibold w-2/5 justify-end">
                            <Link href={`/seasons/${season.slug}/teams/${teamOne.slug ?? teamOne.id}`}>
                                <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                                    {team1.participant.name}
                                </span>
                            </Link>
                            <Image
                                className="ml-2"
                                height={25}
                                width={25}
                                src={teamOne.logo}
                                fallbackSrc={`${getHostName()}/images/${
                                    colorMode === 'light'
                                        ? 'liquipedia_default_light.png'
                                        : 'liquipedia_default_dark.png'
                                }`}
                            />
                        </div>
                        <div className="text-lg font-semibold text-center text-alt-2 w-8">vs</div>
                        <div className="flex flex-row text-xl text-main font-semibold w-2/5 justify-start">
                            <Image
                                className="mr-2"
                                height={25}
                                width={25}
                                src={teamTwo.logo}
                                fallbackSrc={`${getHostName()}/images/${
                                    colorMode === 'light'
                                        ? 'liquipedia_default_light.png'
                                        : 'liquipedia_default_dark.png'
                                }`}
                            />
                            <Link href={`/seasons/${season.slug}/teams/${teamTwo.slug ?? teamTwo.id}`}>
                                <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                                    {team2.participant.name}
                                </span>
                            </Link>
                        </div>
                    </div>
                    <Timer key={match.id} match_date={match.match_date} />
                </div>
            </div>
        </div>
    )
}

const Matches = ({
    upcoming_matches,
    previous_matches,
    teamMap,
}: {
    upcoming_matches: MatchWithDate[]
    previous_matches: MatchWithDate[]
    teamMap: Record<string, ITeam>
}): JSX.Element => {
    return (
        <>
            <div className="py-4">
                <div className="page-title-sm pb-4">Upcoming Matches</div>
                {upcoming_matches.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {upcoming_matches.map((match) => {
                            return <UpcomingMatch key={match.id} match={match} teamMap={teamMap} />
                        })}
                    </div>
                ) : (
                    <div className="p-4 text-center">
                        <span className="text-alt-2 font-semibold">No Upcoming Matches</span>
                    </div>
                )}
            </div>
            <div className="py-4">
                <div className="page-title-sm pb-4">Results</div>
                {previous_matches.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {previous_matches.map((match) => {
                            return <PreviousMatch key={match.id} match={match} teamMap={teamMap} />
                        })}
                    </div>
                ) : (
                    <div className="p-4 text-center">
                        <span className="text-alt-2 font-semibold">No Previous Matches</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default Matches
