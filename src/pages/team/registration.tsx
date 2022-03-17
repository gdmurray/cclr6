import React, { useContext } from 'react'
import TeamLayout from '@components/teams/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { FaTrophy } from 'react-icons/fa'
import EmptyState from '@components/EmptyState'
import { ToornamentClient } from '@lib/api/toornament'
import { Season, SeasonTwoSplit1 } from '@lib/season'

import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import SeasonComponent from '@components/teams/seasons/Season'
import { TeamContext } from '@components/teams/teamContext'
import { PaymentProvider } from '@components/teams/PaymentContext'

dayjs.extend(LocalizedFormat)

const url = '/team/registration'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url,
})(async () => {
    return {
        props: {
            seasons: [SeasonTwoSplit1],
        },
    }
})

// Different States
/*
First check if EVENT has ended
    1. Registration has not opened yet
    2. Registration is Open
    3. Registration has closed
 */

interface IRegistration {
    seasons: Season[]
}

function Registration({ seasons }: IRegistration): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team } = teamContext
    return (
        <PaymentProvider team={team}>
            {seasons.length === 0 && <EmptyState icon={<FaTrophy />} text={'No Seasons Found!'} />}
            <div className={'max-w-4xl mx-auto items-center'}>
                {seasons.map((season) => {
                    return <SeasonComponent key={season.name} season={season} />
                })}
            </div>
        </PaymentProvider>
    )
}

Registration.SEO = {
    title: 'Team Registration',
    url,
}

Registration.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Registration
