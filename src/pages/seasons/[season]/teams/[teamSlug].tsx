import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getCurrentSeason, MatchData } from '@lib/season/common'
import { ToornamentClient } from '@lib/api/toornament'
import React from 'react'
import SeasonLayout, { useSeason } from '@components/season/SeasonLayout'
import { getMatchData, getSeasonTeamsUrls } from '@lib/season/api'
import { adminFireStore } from '@lib/firebase/admin'
import { IPlayer } from '@lib/models/player'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Image, useColorMode } from '@chakra-ui/react'
import { FaTwitter } from 'react-icons/fa'
import Players from '@components/season/team/Players'
import Matches from '@components/season/team/Matches'
import { CreateTeamClient, ITeam, Teams } from '@lib/models/team'
import { getHostName } from '@lib/utils'
import { getMatchDate } from '@components/analyst/match/utils'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const { teamSlug } = params
    const currentSeason = getCurrentSeason(params)

    const client = new ToornamentClient()

    const teamBySlug = await Teams.getTeamBySlug(teamSlug)
    const teamById = await Teams.getTeamById(teamSlug)
    const team = teamBySlug ?? teamById
    if (team == null) {
        return {
            notFound: true,
        }
    }
    const teamClient = await CreateTeamClient(team, adminFireStore)
    const registration = await teamClient.getRegistration(currentSeason.id)

    if (registration == null) {
        console.log('registration null')
        return {
            notFound: true,
        }
    }

    const playerData = await adminFireStore.collection('teams').doc(team.id).collection('players').get()
    const players = playerData.docs.map((player) => {
        return {
            id: player.id,
            ...player.data(),
        } as IPlayer
    })

    const matches = await client.getTeamMatches(currentSeason.TOURNAMENT_ID, registration.participant_id)

    const matchData = await getMatchData(matches, currentSeason)
    const ranking = await client.getTeamRanking(currentSeason.TOURNAMENT_ID, team.id)
    const teamMap = await Teams.getTeamIdMap()

    return {
        props: {
            team,
            ranking,
            teamMap,
            players: players.sort((a: IPlayer, b: IPlayer): number => (a.index > b.index ? 1 : -1)),
            matches: matchData.filter((match) => match.matches != null),
            SEO: {
                title: `${team.name}`,
                image: null,
                url: `${currentSeason.BASE_URL}/teams/${teamSlug}`,
            },
        },
        revalidate: 3600,
    }
}

const SeasonTeamPage = ({
    team,
    players,
    matches,
    ranking,
    teamMap,
}: {
    team: ITeam
    players: IPlayer[]
    matches: MatchData[]
    ranking: {
        number: number
    }
    slugMap: Record<string, string>
    teamMap: Record<string, ITeam>
}): JSX.Element => {
    const season = useSeason()
    const previous_matches = matches
        ? matches
              .filter((round) => round.matches.some((match) => dayjs(getMatchDate(match)) < dayjs()))
              .map((round) => {
                  return round.matches[0]
              })
        : []
    const upcoming_matches = matches
        ? matches
              .filter((round) => round.matches.some((match) => dayjs(getMatchDate(match)) > dayjs()))
              .map((round) => {
                  return round.matches[0]
              })
        : []
    const next_match = upcoming_matches !== undefined && upcoming_matches.length > 0 ? upcoming_matches[0] : null

    function getNextMatchText(): JSX.Element {
        if (!next_match) {
            return <span>No Upcoming Matches</span>
        }

        const match_date = dayjs(next_match.match_date)
        const opponent = next_match.opponents.filter((opp) => opp.participant.custom_user_identifier !== team.id)[0]
        const opponentTeam = teamMap[opponent.participant.custom_user_identifier]
        return (
            <span>
                Next Match on <span className="text-alt">{match_date.format('dddd, MMM D [at] ha')}</span> against{' '}
                <Link href={`/seasons/${season.slug}/teams/${opponentTeam.slug ?? opponentTeam.id}`}>
                    <span className="text-alt cursor-pointer hover:underline hover:text-primary duration-150 transition-colors">
                        {opponent.participant.name}
                    </span>
                </Link>
            </span>
        )
    }

    const { colorMode } = useColorMode()
    if (team) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-main">
                    <div className="flex flex-row py-6">
                        <div className="mr-4">
                            <Image
                                src={team.logo}
                                width={{ base: 100, md: 125 }}
                                height={{ base: 100, md: 125 }}
                                minWidth={{ base: 100, md: 125 }}
                                fallbackSrc={`${getHostName()}/images/${
                                    colorMode === 'light'
                                        ? 'liquipedia_default_light.png'
                                        : 'liquipedia_default_dark.png'
                                }`}
                            />
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
                                Rank &nbsp;{ranking[0].rank ? `#${ranking[0].rank}` : '-'}&nbsp; in CCL Season Two
                            </div>
                            <div className="ml-1 text-subtitle-description">{getNextMatchText()}</div>
                        </div>
                    </div>
                    <Players players={players} />
                    <Matches
                        upcoming_matches={upcoming_matches}
                        previous_matches={previous_matches}
                        teamMap={teamMap}
                    />
                </div>
            </div>
        )
    }
    return <></>
}

SeasonTeamPage.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonTeamPage

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = await getSeasonTeamsUrls()
    return {
        paths,
        fallback: true,
    }
}
