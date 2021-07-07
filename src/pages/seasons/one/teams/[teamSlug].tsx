import React from 'react'
import SeasonLayout from '@components/season/layout'
import { withAuthSSR } from '@lib/withSSRAuth'
import { adminFireStore } from '@lib/firebase/admin'
import { Image } from '@chakra-ui/react'
import Link from 'next/link'
import { ITeam } from '@lib/models/team'
import { IPlayer } from '@lib/models/player'
import { ToornamentClient } from '@lib/api/toornament'
import { getMatchData, MatchData, SeasonOne } from '@lib/season'
import dayjs from 'dayjs'
import Players from '@components/season/team/Players'
import Matches from '@components/season/team/Matches'
import { FaTwitter } from 'react-icons/fa'

// TODO: I'D PREFER SLUGS
export const getServerSideProps = withAuthSSR()(async (ctx) => {
    const tournament_id = '4585711997166354432'
    // const stage_id = '4753738149735563264'

    const {
        query: { teamSlug },
    } = ctx
    const slugs = await adminFireStore.collection('season').doc('one').collection('teams').get()
    const slugToIdMap = slugs.docs.reduce((acc, elem) => {
        const data = elem.data()
        acc[data.slug] = {
            team_id: data.team_id,
            participant_id: data.participant_id,
        }
        return acc
    }, {})

    const idToSlugMap = slugs.docs.reduce((acc, elem) => {
        const data = elem.data()
        acc[data.team_id] = data.slug
        return acc
    }, {})

    if (!(teamSlug in slugToIdMap)) {
        return {
            redirect: {
                destination: '/seasons/one/teams',
                permanent: false,
            },
        }
    }
    const { team_id } = slugToIdMap[teamSlug]
    const teamData = await adminFireStore.collection('teams').doc(team_id).get()
    const team = { id: teamData.id, ...teamData.data() }
    const playerData = await adminFireStore.collection('teams').doc(team_id).collection('players').get()
    const players = playerData.docs.map((player) => {
        return {
            id: player.id,
            ...player.data(),
        } as IPlayer
    })

    const client = new ToornamentClient()
    const matches = await client.getTeamMatches(tournament_id, slugToIdMap[teamSlug].participant_id)
    const matchData = await getMatchData(matches, SeasonOne.BASE_MATCH)
    // matchData.forEach((elem) => {
    //     console.log('Matches: ', elem.matches)
    //     elem.matches.forEach((opp) => {
    //         console.log(opp.opponents)
    //     })
    // })

    const ranking = await client.getTeamRanking(tournament_id, team_id)
    return {
        props: {
            team,
            ranking,
            players: players.sort((a: IPlayer, b: IPlayer): number => (a.index > b.index ? 1 : -1)),
            matches: matchData,
            slugMap: idToSlugMap,
        },
    }
})

const SeasonTeam = ({
    team,
    players,
    matches,
    ranking,
    slugMap,
}: {
    team: ITeam
    players: IPlayer[]
    matches: MatchData[]
    ranking: {
        number: number
    }
    slugMap: Record<string, string>
}): JSX.Element => {
    const previous_matches = matches
        .filter((round) => round.matches.some((match) => dayjs(match.match_date) < dayjs()))
        .map((round) => {
            return round.matches[0]
        })
    const upcoming_matches = matches
        .filter((round) => round.matches.some((match) => dayjs(match.match_date) > dayjs()))
        .map((round) => {
            return round.matches[0]
        })
    const next_match = upcoming_matches.length > 0 ? upcoming_matches[0] : null

    function getNextMatchText(): JSX.Element {
        if (!next_match) {
            return <span>No Upcoming Matches</span>
        }

        const match_date = dayjs(next_match.match_date)
        const opponent = next_match.opponents.filter((opp) => opp.participant.custom_user_identifier !== team.id)[0]
        return (
            <span>
                Next Match on <span className="text-alt">{match_date.format('dddd, MMM D [at] ha')}</span> against{' '}
                <Link href={`/seasons/one/teams/${slugMap[opponent.participant.custom_user_identifier]}`}>
                    <span className="text-alt cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                        {opponent.participant.name}
                    </span>
                </Link>
            </span>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-main">
                <div className="flex flex-row py-6">
                    <div className="mr-4">
                        <Image src={team.logo} width={125} height={125} />
                    </div>
                    <div className="py-4">
                        <div className="text-4xl font-semibold flex flex-row items-center">
                            {team.name}
                            {team.twitter && (
                                <div className="text-2xl ml-4">
                                    <a
                                        className="hover:text-twitter"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`https://twitter.com/${team.twitter}`}
                                    >
                                        <FaTwitter />
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="ml-1 text-subtitle">
                            Rank &nbsp;{ranking[0].rank ? `#${ranking[0].rank}` : '-'}&nbsp; in CCL Season One
                        </div>
                        <div className="ml-1 text-subtitle-description">{getNextMatchText()}</div>
                    </div>
                </div>
                <Players players={players} />
                <Matches upcoming_matches={upcoming_matches} previous_matches={previous_matches} slugMap={slugMap} />
            </div>
        </div>
    )
}

SeasonTeam.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={`/seasons/one`}>{content}</SeasonLayout>
}

export default SeasonTeam
