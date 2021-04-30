import React from 'react'
import TeamLayout from '@components/teams/layout'
import EmptyState from '@components/EmptyState'
import { FaRegCreditCard } from 'react-icons/fa'

function Payments(): JSX.Element {
    const payments = []
    return (
        <>
            {payments.length === 0 && (
                <EmptyState icon={<FaRegCreditCard />} text={'No Payments Found'} />
            )}
        </>
    )
}

Payments.SEO = {
    title: 'Team Payments',
    url: '/team/payments'
}

Payments.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Payments