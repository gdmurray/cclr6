import React from 'react'
import TeamLayout from '@components/teams/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { FaCalendarAlt, FaTrophy } from 'react-icons/fa'
import EmptyState from '@components/EmptyState'
import { ToornamentClient } from '@lib/api/toornament'
import { Season, SeasonOne } from '@lib/models/season'

import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import SeasonComponent from '@components/teams/seasons/Season'

dayjs.extend(LocalizedFormat)

const url = '/team/registration'
// TODO: Toggle the eligibility check by first checking if the tournament is even active lmao
// TODO: this is where we'd fetch some information from toornaments api... when we have access
export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})(async ({ user }) => {
    async function getData() {
        const season = SeasonOne
        const client = ToornamentClient()
        client.getTournaments()
        for (let i = 0; i < 4; i += 1) {
            season.qualifiers[i] = await client.getTournament(i)
        }
        return Promise.resolve([season])
    }

    const seasons = await getData()
    return {
        props: {
            seasons
        }
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
    seasons: Season[];
}

function Registration({ seasons }: IRegistration): JSX.Element {
    return (
        <>
            {seasons.length === 0 && (
                <EmptyState icon={<FaTrophy />} text={'No Seasons Found!'} />
            )}
            <div className={'max-w-4xl mx-auto items-center'}>
                {seasons.map((season) => {
                    return (
                        <SeasonComponent key={season.name} season={season} />
                    )
                })}
            </div>

        </>
    )
}

Registration.SEO =
    {
        title: 'Team Registration',
        url
    }

Registration.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Registration


// <Eligibility tournament={tournament} team={team} user={user} />
// linear-gradient(180deg, #00000065 40%, #ffffff10 100%)
// <motion.div
// className='max-w-lg z-0'
// whileHover={{
//     scale: 1.1,
//         transition: { duration: 0.6 }
// }}
// style={{
//     // boxShadow: '#00000030 -19px 0px 1em 10px inset',
//     // boxShadow: "inset 0 0 4em 1em #000",
//     position: 'relative',
//         top: '-100%',
//         cursor: 'pointer',
//         width: '35%',
//         height: '100%',
//         overflow: 'hidden',
//         background: `linear-gradient(to right, #1C191780, #44403C70, #00000090), url('${tournament.logo.original}')`,
//         backgroundRepeat: 'repeat-x, no-repeat',
//         backgroundSize: 'contain, cover',
//         backgroundPosition: 'center'
// }} />