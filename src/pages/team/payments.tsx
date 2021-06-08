import React, { useEffect, useState } from 'react'
import TeamLayout from '@components/teams/layout'
import EmptyState from '@components/EmptyState'
import { FaPaypal, FaRegCreditCard, FaRegEnvelope } from 'react-icons/fa'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import Table from 'rc-table'
// import { TeamContext } from '@components/teams/teamContext'
import Loader from '@components/Loader'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: '/team/payments',
})({})

function Payments(): JSX.Element {
    // const teamContext = useContext(TeamContext)
    // const { team, user } = teamContext
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('/api/team/payments', {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            if (result.ok) {
                result.json().then((response) => {
                    setLoading(false)
                    setData(response.payments)
                })
            } else {
                setLoading(false)
            }
        })
    }, [])

    const columns = [
        {
            title: 'Season',
            dataIndex: 'season',
            key: 'season',
        },
        {
            title: 'Payment Type',
            dataIndex: 'type',
            key: 'type',
            render: (payment_type: string) => {
                if (payment_type === 'paypal') {
                    return <FaPaypal />
                } else {
                    return <FaRegEnvelope />
                }
            },
        },
        {
            title: 'Payment Email',
            dataIndex: ['payment', 'payer', 'email_address'],
        },
        {
            title: 'Amount',
            dataIndex: ['payment', 'purchase_units'],
            key: 'amount',
            render: (purchase_units) => {
                console.log(purchase_units)
                const [{ amount }] = purchase_units
                return `$${amount.value} ${amount.currency_code}`
            },
        },
        {
            title: 'Status',
            dataIndex: ['payment', 'status'],
            key: 'status',
        },
    ]

    return (
        <>
            {loading && <Loader text="Loading Payments" />}
            {!loading && data.length === 0 && <EmptyState icon={<FaRegCreditCard />} text={'No Payments Found!'} />}
            {!loading && data.length > 0 && (
                <Table className="data-table" columns={columns} data={data} rowKey={(elem) => elem.id} />
            )}
        </>
    )
}

Payments.SEO = {
    title: 'Team Payments',
    url: '/team/payments',
}

Payments.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Payments
