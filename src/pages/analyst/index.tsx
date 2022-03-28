import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import React from 'react'
import { AnalystLayout } from '@components/analyst/layout'
import { Table } from 'antd'
import { defaultSeason, Season } from '@lib/season'
import { FaChevronRight } from 'react-icons/fa'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ColumnsType } from 'antd/es/table'

export const getServerSideProps = withAuthSSR({
    whenNotAnalyst: AuthAction.REDIRECT_TO_APP,
})(async () => {
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
    return {
        props: {
            seasonMap,
        },
    }
})

const AnalystHome = ({ seasonMap = {} }) => {
    const seasons = Object.values(seasonMap) as Season[]
    const { push } = useRouter()
    const columns: ColumnsType<Season> = [
        {
            title: 'Name',
            dataIndex: 'short_name',
            key: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => {
                return (
                    <Button
                        aria-label={'matches'}
                        onClick={() => {
                            push(`/analyst/${record.id}`)
                        }}
                        rightIcon={<FaChevronRight />}
                    >
                        Matches
                    </Button>
                )
            },
        },
    ]
    return (
        <div>
            <Table rowKey={(row) => row.id} columns={columns} dataSource={seasons} />
        </div>
    )
}

AnalystHome.layout = (content: React.ReactNode): JSX.Element => {
    return <AnalystLayout>{content}</AnalystLayout>
}
export default AnalystHome
