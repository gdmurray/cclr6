import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import AdminLayout from '@components/admin/layout'
import React from 'react'
import { SeasonOne } from '@lib/models/season'
import { ToornamentClient } from '@lib/api/toornament'
import Table from 'rc-table'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { FaChevronCircleRight } from 'react-icons/fa'
import { useRouter } from 'next/router'


dayjs.extend(LocalizedFormat)

export const getServerSideProps = withAuthSSR({
    whenNotAdmin: AuthAction.REDIRECT_TO_APP
})(async (ctx) => {
    const season = SeasonOne
    const client = new ToornamentClient()
    const qualifiers = []
    for (let i = 0; i < season.qualifiers.length; i += 1) {
        const { id } = season.qualifiers[i]
        const qual = await client.getTournament(id)
        qualifiers.push(qual)
    }
    return {
        props: {
            data: qualifiers
        }
    }
})

const AdminSeason = ({ data }) => {
    const { push } = useRouter()
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Date',
            dataIndex: 'scheduled_date_start',
            key: 'scheduled_date_start'
        },
        {
            title: 'Reg Open',
            dataIndex: 'registration_opening_datetime',
            key: 'registration_opening_datetime',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            }
        },
        {
            title: 'Reg Closed',
            dataIndex: 'registration_closing_datetime',
            key: 'registration_closing_datetime',
            render: (val) => {
                return <>{dayjs(val).format('LLL')}</>
            }
        },
        {
            title: 'Players',
            dataIndex: 'size',
            key: 'size'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (val) => {
                return <><FaChevronCircleRight className='cursor-pointer'
                                               onClick={() => push(`/admin/season/${val.id}`)} /></>
            }
        }
    ]
    return <div>
        <Table rowKey={(record) => record.id} className='data-table' columns={columns} data={data} />
    </div>
}

AdminSeason.layout = (content: React.ReactNode): JSX.Element => {
    return <AdminLayout>{content}</AdminLayout>
}

export default AdminSeason