import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getCurrentSeason, getSeasonPaths } from '@lib/season/common'
import { ToornamentClient } from '@lib/api/toornament'
import { ITeam, Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { getIdToSlugMap } from '@lib/season/api'
import { IPlayer } from '@lib/models/player'
import { Image, useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getHostName } from '@lib/utils'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const currentSeason = getCurrentSeason(params)
    const client = new ToornamentClient()
    const rankings = await client.getRankings(currentSeason.TOURNAMENT_ID)
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

    const idToSlugMap = await getIdToSlugMap(params.season)
    return {
        props: {
            rankings,
            teams: teamMap,
            idToSlugMap: idToSlugMap,
            SEO: {
                title: `${currentSeason.TITLE} Teams `,
                image: null,
                url: `${currentSeason.BASE_URL}/teams`,
            },
        },
        revalidate: 3600,
    }
}

interface TeamWithPlayers extends ITeam {
    players: IPlayer[]
}

interface SeasonTeamProps {
    rankings: Record<string, any>[]
    teams: TeamWithPlayers[]
    idToSlugMap: Record<string, string>
}

function TeamPlayer({ player }: { player: IPlayer }): JSX.Element {
    const { colorMode } = useColorMode()
    return (
        <div className="flex flex-col justify-start sm:justify-center h-6 sm:h-12 md:h-28">
            <Image
                className="mx-auto hidden md:block"
                src={`${getHostName()}/images/${
                    colorMode === 'light' ? 'liquipedia_default_light.png' : 'liquipedia_default_dark.png'
                }`}
                width={59}
            />
            <div className="flex flex-row justify-end sm:justify-center mt-1 text-sm md:text-xs font-medium sm:text-center whitespace-nowrap">
                <span style={{ paddingTop: '5px' }}>
                    <img
                        alt="country"
                        style={{ width: '12px', marginRight: '0.25em', position: 'static' }}
                        src={`${getHostName()}/images/${player.country.toLowerCase()}.svg`}
                    />
                </span>
                {player.uplay}
            </div>
        </div>
    )
}

const SeasonTeams = ({ rankings, teams, idToSlugMap }: SeasonTeamProps) => {
    const router = useRouter()
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col space-y-4">
                {(rankings ? rankings : []).map((rank) => {
                    const team = teams[rank.participant.custom_user_identifier]
                    const slug = idToSlugMap[rank.participant.custom_user_identifier]

                    const goToTeam = () => {
                        router.push(`/seasons/one/teams/${slug}`)
                    }

                    const players = [...team.players].sort((a, b) => (a.index > b.index ? 1 : -1))

                    if (team) {
                        return (
                            <div
                                key={team.id}
                                onClick={goToTeam}
                                className="bordered group border rounded-lg py-2 px-4 flex flex-col text-main dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm cursor-pointer"
                            >
                                <div className="flex flex-row justify-between py-2">
                                    <div className="flex flex-row text-xl font-semibold">
                                        <div className="text-alt">{rank.rank}.&nbsp;</div>
                                        <div className="group-hover:underline">{team.name}</div>
                                    </div>
                                    <div className="text-lg font-medium">
                                        {rank.points ? rank.points : '-'} <span className="text-alt-2">pts</span>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className=" md:p-2 md:mr-8 ">
                                        <Image
                                            minWidth={{ base: 120, sm: 150 }}
                                            width={{ base: 120, sm: 150 }}
                                            height={{ base: 120, sm: 150 }}
                                            src={team ? team.logo : undefined}
                                        />
                                    </div>
                                    <div className="w-full pr-2">
                                        <div>
                                            <div className="flex flex-col">
                                                <div className="text-main font-semibold sm:text-center text-right">
                                                    Players
                                                </div>
                                                <div className="flex sm:flex-row flex-col sm:space-x-2 md:space-x-4 lg:space-x-8 w-full justify-center md:justify-evenly max-w-3xl mx-auto pb-2 sm:pb-0">
                                                    {players
                                                        .filter((_, idx) => idx < 5)
                                                        .map((player) => {
                                                            return <TeamPlayer key={player.id} player={player} />
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-main font-semibold sm:text-center text-right">
                                                Substitutes
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-center sm:space-x-6">
                                                {players.filter((_, idx) => idx > 4).length > 0 ? (
                                                    <>
                                                        {players
                                                            .filter((_, idx) => idx > 4)
                                                            .map((player) => {
                                                                return (
                                                                    <div
                                                                        key={player.id}
                                                                        className="flex flex-row mt-1 text-sm font-medium whitespace-nowrap justify-end sm:justify-center"
                                                                    >
                                                                        <span style={{ paddingTop: '6px' }}>
                                                                            <img
                                                                                alt="country"
                                                                                style={{
                                                                                    minWidth: '12px',
                                                                                    width: '12px',
                                                                                    marginRight: '0.15em',
                                                                                    position: 'static',
                                                                                }}
                                                                                src={`${getHostName()}/images/${player.country.toLowerCase()}.svg`}
                                                                            />
                                                                        </span>
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
                            </div>
                        )
                    }
                    return <></>
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

SeasonTeams.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonTeams

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    return {
        paths: getSeasonPaths('teams'),
        fallback: true,
    }
}
