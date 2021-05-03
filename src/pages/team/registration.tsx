import React, { useContext, useEffect, useState } from 'react'
import TeamLayout from '@components/teams/layout'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'
import { CreateTournamentClient, Tournament } from '@lib/models/tournament'
import { data as tournaments } from '@components/teams/mockToornament'
import { TeamContext } from '@components/teams/teamContext'
import { FaBan, FaCalendarAlt, FaCheck, FaGamepad, FaStop, FaStopCircle, FaTrophy } from 'react-icons/fa'
import { motion } from 'framer-motion'
import EmptyState from '@components/EmptyState'
import {
    Button,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Tooltip
} from '@chakra-ui/react'
import { ToornamentClient } from '@lib/api/toornament'
import { useRouter } from 'next/router'
import { CreateTeamClient } from '@lib/models/team'
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


const TournamentDetails = ({ children, tournament }): JSX.Element => {
    return (
        <div className='bordered border rounded-xl h-52 overflow-hidden'>
            <div className='flex flex-row w-full p-4 h-full z-10 relative'>
                <div className='flex-1 flex flex-col justify-between'>
                    <div>
                        <div className='text-main font-heavy text-2xl md:text-3xl font-bold'>
                            {tournament.full_name}
                        </div>
                        <div className='mt-1'>
                            <div className='font-semibold text-alt text-sm'>Schedule</div>
                            <div className='flex flex-row items-center text-alt-2 font-medium text-sm'>
                                <FaCalendarAlt />&nbsp;{dayjs(tournament.scheduled_date_start).format('LL')}&nbsp;&nbsp;-&nbsp;&nbsp;{dayjs(tournament.scheduled_date_end).format('LL')}
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div className='flex flex-col justify-between'>
                    {children}
                </div>
            </div>
        </div>
    )
}



// <Eligibility tournament={tournament} team={team} user={user} />
// linear-gradient(180deg, #00000065 40%, #ffffff10 100%)
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

// <TournamentRegistration key={tournament.id} tournament={tournament} />
Registration.SEO =
    {
        title: 'Team Registration',
        url
    }

Registration.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Registration


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