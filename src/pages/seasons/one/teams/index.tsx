import React from 'react'
import SeasonLayout from '@components/season/layout'
import { withAuthSSR } from '@lib/withSSRAuth'
import { ToornamentClient } from '@lib/api/toornament'
import { ITeam, Teams } from '@lib/models/team'
import { Image, useColorMode } from '@chakra-ui/react'
import { adminFireStore } from '@lib/firebase/admin'
import { getHostName } from '@lib/utils'
import { useRouter } from 'next/router'
import { IPlayer } from '@lib/models/player'

export const getServerSideProps = withAuthSSR()(async () => {
    const client = new ToornamentClient()
    const tournament_id = '4585711997166354432'
    const rankings = await client.getRankings(tournament_id)
    const teamData = await Teams.getTeams()
    const teamMap = teamData.docs.reduce((acc, elem) => {
        acc[elem.id] = {
            ...elem.data(),
        }
        return acc
    }, {})

    for (const id of Object.keys(teamMap)) {
        const players = await adminFireStore.collection('teams').doc(id).collection('players').get()
        teamMap[id].players = players.docs.map((player) => {
            return {
                id: player.id,
                ...player.data(),
            }
        })
    }

    const slugs = await adminFireStore.collection('season').doc('one').collection('teams').get()
    const idToSlugMap = slugs.docs.reduce((acc, elem) => {
        const data = elem.data()
        acc[data.team_id] = data.slug
        return acc
    }, {})
    return {
        props: {
            rankings,
            teams: teamMap,
            idToSlugMap: idToSlugMap,
        },
    }
})

interface TeamWithPlayers extends ITeam {
    players: IPlayer[]
}

interface SeasonOneTeamProps {
    rankings: Record<string, any>[]
    teams: TeamWithPlayers[]
    idToSlugMap: Record<string, string>
}

const SeasonOneTeams = ({ rankings, teams, idToSlugMap }: SeasonOneTeamProps): JSX.Element => {
    const { colorMode } = useColorMode()
    const router = useRouter()
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col space-y-4">
                {rankings.map((rank) => {
                    const team = teams[rank.participant.custom_user_identifier]
                    const slug = idToSlugMap[rank.participant.custom_user_identifier]

                    const goToTeam = () => {
                        router.push(`/seasons/one/teams/${slug}`)
                    }

                    const players = [...team.players].sort((a, b) => (a.index > b.index ? 1 : -1))
                    return (
                        <div
                            key={team.id}
                            onClick={goToTeam}
                            className="bordered group border rounded-lg py-2 px-4 flex flex-col text-main dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm cursor-pointer"
                        >
                            <div className="flex flex-row justify-between py-2">
                                <div className="flex flex-row text-xl font-semibold">
                                    <div className="text-alt">{rank.number}.&nbsp;</div>
                                    <div className="group-hover:underline">{team.name}</div>
                                </div>
                                <div className="text-lg font-medium">
                                    {rank.points ? rank.points : '-'} <span className="text-alt-2">pts</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                <div className="p-2 mr-8" style={{ width: '150px' }}>
                                    <Image src={team.logo} width={150} height={150} style={{ minWidth: '150px' }} />
                                </div>
                                <div className="flex flex-row space-x-6 w-full">
                                    {players
                                        .filter((_, idx) => idx < 5)
                                        .map((player) => {
                                            return (
                                                <div
                                                    key={player.id}
                                                    className="flex flex-col justify-center pt-5"
                                                    style={{ width: '90px', height: '150px' }}
                                                >
                                                    <Image
                                                        className="mx-auto"
                                                        src={`${getHostName()}/images/${
                                                            colorMode === 'light'
                                                                ? 'liquipedia_default_light.png'
                                                                : 'liquipedia_default_dark.png'
                                                        }`}
                                                        width={76}
                                                    />
                                                    <div className="flex flex-row justify-center mt-1 text-xs font-medium text-center whitespace-nowrap">
                                                        <img
                                                            alt="country"
                                                            style={{ width: '12px', marginRight: '0.25em' }}
                                                            src={`${getHostName()}/images/${player.country.toLowerCase()}.svg`}
                                                        />
                                                        {player.uplay}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                                <div className="py-8">
                                    <div className="text-main font-semibold text-center">Substitutes</div>
                                    <div>
                                        {players.filter((_, idx) => idx > 4).length > 0 ? (
                                            <>
                                                {players
                                                    .filter((_, idx) => idx > 4)
                                                    .map((player) => {
                                                        return (
                                                            <div
                                                                key={player.id}
                                                                className="flex flex-row mt-1 text-sm font-medium whitespace-nowrap"
                                                            >
                                                                <img
                                                                    style={{ width: '12px', marginRight: '0.25em' }}
                                                                    src={`${getHostName()}/images/${
                                                                        player.country
                                                                    }.svg`}
                                                                />
                                                                {player.uplay}
                                                            </div>
                                                        )
                                                    })}
                                            </>
                                        ) : (
                                            <span className="text-alt-2 font-medium text-sm">No subs</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <style jsx>{`
                .chakra-image {
                    image-rendering: -moz-crisp-edges; /* Firefox */
                    image-rendering: -o-crisp-edges; /* Opera */
                    image-rendering: crisp-edges;
                    -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
                }
            `}</style>
        </div>
    )
}

SeasonOneTeams.SEO = {
    url: '/seasons/one/teams',
    title: 'Season One Teams',
    description: 'Teams playing in Season One of Canada Contenders League',
}

SeasonOneTeams.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={'/seasons/one'}>{content}</SeasonLayout>
}
export default SeasonOneTeams
