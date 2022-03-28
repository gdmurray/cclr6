import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import React from 'react'
import { AnalystLayout } from '@components/analyst/layout'
import { Table } from 'antd'
import { defaultSeason } from '@lib/season'
import { FaCheck, FaChevronRight, FaTimes } from 'react-icons/fa'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ColumnsType } from 'antd/es/table'
import { ToornamentClient } from '@lib/api/toornament'
import dayjs from 'dayjs'
import { Teams } from '@lib/models/team'
import { adminFireStore } from '@lib/firebase/admin'
import { Match } from '@lib/models/toornament'
import { getMatchDate } from '@components/analyst/match/utils'

export const getServerSideProps = withAuthSSR({
    whenNotAnalyst: AuthAction.REDIRECT_TO_APP,
})(async ({ params }) => {
    const seasonMap = [defaultSeason].reduce((acc, elem) => {
        delete elem.BASE_MATCH
        delete elem.WEEK_FORMATTER
        acc[elem.id] = elem
        for (const qual of elem.qualifiers) {
            if (qual.toornament_id != null) {
                acc[qual.id] = qual
            }
        }
        return acc
    }, {})
    if (!(params.seasonId in seasonMap)) {
        return {
            notFound: true,
        }
    }
    const season = seasonMap[params.seasonId]
    const client = new ToornamentClient()
    const matches = await client.getMatches(season.TOURNAMENT_ID)
    const teamData = await Teams.getTeams()
    const teamMap = teamData.docs.reduce((acc, elem) => {
        acc[elem.id] = {
            id: elem.id,
            ...elem.data(),
        }
        return acc
    }, {})

    const matchList = [...matches]
        .sort((a, b) => {
            const dateOne = dayjs(getMatchDate(a))
            const dateTwo = dayjs(getMatchDate(b))
            return dateOne.isAfter(dateTwo) ? 1 : -1
        })
        .filter((match) => match.opponents[0].participant !== null)
        .map((match) => {
            // console.log(match.opponents[0])
            // const teamOne = match.opponents[0].participant
            // const teamTwo = match.opponents[1].participant
            return {
                ...match,
                team_one: teamMap[match.opponents[0].participant.custom_user_identifier].name,
                team_two: teamMap[match.opponents[1].participant.custom_user_identifier].name,
            }
        })

    const stats = await adminFireStore.collection('matchStats').get()
    const matchesWithStats = stats.docs.map((elem) => elem.data().match_id)

    // console.log(matchList)
    return {
        props: {
            matches: matchList,
            matchesWithStats,
        },
    }
})

const AnalystSeasonPage = ({
    matches = [],
    matchesWithStats = [],
}: {
    matches: Match[]
    matchesWithStats: string[]
}) => {
    const { push } = useRouter()
    const columns: ColumnsType<Match> = [
        {
            title: 'Team 1',
            dataIndex: 'team_one',
            key: 'team_one',
        },
        {
            title: 'Team 2',
            dataIndex: 'team_two',
            key: 'team_two',
        },
        {
            title: 'Match Date',
            key: 'match_date',
            render: (record) => {
                return <>{dayjs(getMatchDate(record)).toISOString()}</>
            },
        },
        {
            title: 'Report Closed',
            dataIndex: 'report_closed',
            key: 'report_closed',
            render: (closed) => {
                if (closed) {
                    return <FaCheck className={'text-success'} />
                }
                return <FaTimes className={'text-danger'} />
            },
        },
        {
            title: 'Has Stats',
            key: 'has_stats',
            render: (record) => {
                if (matchesWithStats.includes(record.id)) {
                    return <FaCheck className={'text-success'} />
                }
                return <FaTimes className={'text-danger'} />
            },
        },
        {
            title: 'Stats',
            key: 'actions',
            render: (record) => {
                return (
                    <Button
                        aria-label={'matches'}
                        onClick={() => {
                            push(`/analyst/match/${record.id}`)
                        }}
                        rightIcon={<FaChevronRight />}
                    >
                        Edit Stats
                    </Button>
                )
            },
        },
    ]
    return (
        <div>
            <Table rowKey={(row) => row.id} columns={columns} dataSource={matches} />
        </div>
    )
}

AnalystSeasonPage.layout = (content: React.ReactNode): JSX.Element => {
    return <AnalystLayout>{content}</AnalystLayout>
}

export default AnalystSeasonPage
