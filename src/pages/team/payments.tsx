import React from 'react'
import TeamLayout from '@components/teams/layout'
import EmptyState from '@components/EmptyState'
import { FaRegCreditCard } from 'react-icons/fa'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { SeasonOne } from '@lib/models/season'
import { ToornamentClient } from '@lib/api/toornament'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: '/team/payments'
})(async ({ user }) => {
    // async function getData() {
    //     const season = SeasonOne
    //     const client = new ToornamentClient()
    //     for (let i = 0; i < 4; i += 1) {
    //         season.qualifiers[i] = await client.getTournament(i)
    //     }
    //     return Promise.resolve([season])
    // }
    //
    // const seasons = await getData()
    return {
        props: {
            seasons: []
        }
    }
})

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