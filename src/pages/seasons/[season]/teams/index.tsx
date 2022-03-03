import { GetStaticPropsResult } from 'next'
import React, { useEffect, useState } from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'
import { Tab, TabList, TabPanels, Tabs, TabPanel, Image, useColorMode } from '@chakra-ui/react'
import { SeasonTwoSplit1 } from '@lib/models/season'
import { getHostName } from '@lib/utils'
import { IPlayer } from '@lib/models/player'
import Loader from '@components/Loader'
import { useRouter } from 'next/router'

// import { getStaticProps as getTeamsStaticProps } from '@components/season/one/teams'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    // const { season } = params
    // if (season === 'one') {
    // this needs to be wrapped in { }, but lets ignore that for now.
    //     return getTeamsStaticProps(params)
    // }
    // if(season === "two"){
    //
    // }
    return {
        props: {},
    }
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

const QualifierTeams = ({ qualifier_id }: { qualifier_id: string }): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true)
    const [participants, setParticipants] = useState([])
    useEffect(() => {
        fetch(`/api/qualifier/${qualifier_id}/participants?team_data=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((res) => {
                setLoading(false)
                setParticipants(res.participants)
            })
        })
    }, [])

    if (loading) {
        return <Loader text={'Loading Teams'} />
    }
    return (
        <div className="flex flex-col space-y-4">
            {participants.length === 0 && <div className="text-alt-2 font-medium">No teams registered</div>}
            {participants.map((team) => {
                const players = [...team.players].sort((a, b) => (a.index > b.index ? 1 : -1))
                return (
                    <div
                        key={team.id}
                        className="bordered group border rounded-lg py-2 px-4 flex flex-col text-main dark:hover:border-gray-700 hover:border-gray-400 hover:shadow-sm"
                    >
                        <div className="flex flex-row justify-between py-2">
                            <div className="flex flex-row text-xl font-semibold">
                                {/*<div className="text-alt">1.&nbsp;</div>*/}
                                <div className="group-hover:underline">{team.name}</div>
                            </div>
                            <div className="text-lg font-medium">{/*<span className="text-alt-2">pts</span>*/}</div>
                        </div>
                        <div className="flex flex-row">
                            <div className=" md:p-2 md:mr-8 ">
                                <Image
                                    minWidth={{ base: 120, sm: 150 }}
                                    width={{ base: 120, sm: 150 }}
                                    height={{ base: 120, sm: 150 }}
                                    src={team.logo ? team.logo : `${getHostName()}/favicon.svg`}
                                />
                            </div>
                            <div className="w-full pr-2">
                                <div>
                                    <div className="flex flex-col">
                                        <div className="text-main font-semibold sm:text-center text-right">Players</div>
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
                                    <div className="text-main font-semibold sm:text-center text-right">Substitutes</div>
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
            })}
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
const SeasonTeams = (): JSX.Element => {
    const router = useRouter()

    function getDefaultIndex() {
        const { sid } = router.query
        if (sid) {
            console.log(sid)
            const idx = SeasonTwoSplit1.qualifiers.map((elem) => elem.id).indexOf(sid as string)
            console.log('idx: ', idx)
            if (idx != -1) {
                return idx
            }
        }
        return 0
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-alt-2 font-medium">
                <Tabs variant="soft-rounded" colorScheme="green" defaultIndex={getDefaultIndex()}>
                    <TabList className="space-x-2">
                        {SeasonTwoSplit1.qualifiers.map((qual) => (
                            <Tab key={qual.id}>{qual.name}</Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {SeasonTwoSplit1.qualifiers.map((qual) => (
                            <TabPanel key={qual.id + '-teams'}>
                                <QualifierTeams qualifier_id={qual.id} />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    )
}

SeasonTeams.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonTeams

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = getSeasonPaths('teams')
    return {
        paths: paths,
        fallback: true,
    }
}
