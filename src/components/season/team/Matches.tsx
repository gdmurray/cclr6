import React, { useEffect, useState } from 'react'
import { MatchWithDate } from '@lib/season/common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ITeam, Teams } from '@lib/models/team'
import Loader from '@components/Loader'
import { Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

dayjs.extend(duration)

const Timer = ({ match_date }: { match_date: string }) => {
    const [timeleft, setTimeLeft] = useState<string>()
    useEffect(() => {
        const _timer = setTimeout(() => {
            setTimeLeft(dayjs.duration(dayjs(match_date).diff(dayjs())).format('D[d] H[h] m[m] s[s]'))
        }, 1000)
    })

    return (
        <div className="text-center font-semibold text-alt py-2">
            <span>{dayjs(match_date).format('ha [EST]')} · </span>
            <span className="text-alt-2 text-sm">Game in</span> {timeleft}
        </div>
    )
}

function UpcomingMatch({
    match,
    teamMap,
    slugMap,
}: {
    match: MatchWithDate
    teamMap: Record<string, ITeam>
    slugMap: Record<string, string>
}): JSX.Element {
    const [team1, team2] = match.opponents

    const {
        query: { teamSlug },
    } = useRouter()

    return (
        <div>
            <div className="text-subtitle pb-1">{dayjs(match.match_date).format('dddd, MMMM D')}</div>
            <div>
                <div className="bordered border rounded-lg px-4 pt-4 flex flex-col">
                    <div className="flex flex-row w-full space-x-1 sm:space-x-6 justify-center ">
                        <div className="flex flex-row text-lg sm:text-xl text-main font-semibold w-2/5 justify-end">
                            {slugMap[team1.participant.custom_user_identifier] === teamSlug ? (
                                <span>{team1.participant.name}</span>
                            ) : (
                                <Link href={`/seasons/one/teams/${slugMap[team1.participant.custom_user_identifier]}`}>
                                    <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                                        {team1.participant.name}
                                    </span>
                                </Link>
                            )}{' '}
                            <Image
                                className="ml-2"
                                height={25}
                                width={25}
                                src={teamMap[team1.participant.custom_user_identifier].logo}
                            />
                        </div>
                        <div className="text-lg font-semibold text-center text-alt-2 w-8">vs</div>
                        <div className="flex flex-row text-xl text-main font-semibold w-2/5 justify-start">
                            <Image
                                className="mr-2"
                                height={25}
                                width={25}
                                src={teamMap[team2.participant.custom_user_identifier].logo}
                            />
                            {slugMap[team2.participant.custom_user_identifier] === teamSlug ? (
                                <span>{team2.participant.name}</span>
                            ) : (
                                <Link href={`/seasons/one/teams/${slugMap[team2.participant.custom_user_identifier]}`}>
                                    <span className="cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                                        {team2.participant.name}
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                    <Timer match_date={match.match_date} />
                </div>
            </div>
        </div>
    )
}

const Matches = ({
    upcoming_matches,
    // previous_matches,
    slugMap,
}: {
    upcoming_matches: MatchWithDate[]
    previous_matches: MatchWithDate[]
    slugMap: Record<string, string>
}): JSX.Element => {
    const [teamMap, setTeamMap] = useState<Record<string, ITeam>>()
    useEffect(() => {
        Teams.getTeams().then((teams) => {
            setTeamMap(
                teams.docs.reduce((acc, team) => {
                    acc[team.id] = team.data()
                    return acc
                }, {})
            )
        })
    }, [])
    return (
        <>
            <div className="py-4">
                <div className="page-title-sm pb-4">Upcoming Matches</div>
                {teamMap ? (
                    <div className="flex flex-col space-y-4">
                        {upcoming_matches.map((match) => {
                            return <UpcomingMatch key={match.id} match={match} teamMap={teamMap} slugMap={slugMap} />
                        })}
                    </div>
                ) : (
                    <Loader height={16} text={'Loading Matches'} />
                )}
            </div>
            <div className="py-4">
                <div className="page-title-sm">Results</div>
                <div className="p-4 text-center">
                    <span className="text-alt-2 font-semibold">No Previous Matches</span>
                </div>
            </div>
        </>
    )
}

export default Matches
