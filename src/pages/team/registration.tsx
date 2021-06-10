import React from 'react'
import TeamLayout from '@components/teams/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { FaTrophy } from 'react-icons/fa'
import EmptyState from '@components/EmptyState'
import { ToornamentClient } from '@lib/api/toornament'
import { Season, SeasonOne } from '@lib/models/season'

import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import SeasonComponent from '@components/teams/seasons/Season'

dayjs.extend(LocalizedFormat)

const url = '/team/registration'

export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url,
})(async () => {
    const season = SeasonOne
    const client = new ToornamentClient()

    const qualifiers = []
    for (let i = 0; i < season.qualifiers.length; i += 1) {
        const { id } = season.qualifiers[i]
        const qual = await client.getTournament(id)
        qualifiers.push(qual)
    }

    season.qualifiers = qualifiers
    return {
        props: {
            seasons: [season],
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
    return (
        <>
            {seasons.length === 0 && <EmptyState icon={<FaTrophy />} text={'No Seasons Found!'} />}
            <div className={'max-w-4xl mx-auto items-center'}>
                {seasons.map((season) => {
                    return <SeasonComponent key={season.name} season={season} />
                })}
            </div>
        </>
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
