import React, { useContext } from 'react'
import TeamLayout from '@components/teams/layout'
import { TeamContext } from '@components/teams/teamContext'
import { AuthAction, withAuthSSR } from '@lib/withSSRAuth'

const url = '/team'
export const getServerSideProps = withAuthSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    referral: url
})({})

function Team(): JSX.Element {
    const teamContext = useContext(TeamContext)
    const { team, user } = teamContext
    console.log(team, user)
    return (
        <>
            This is where some team info would go
        </>
    )
}

Team.SEO = {
    title: 'Team Page',
    url
}

Team.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}
export default Team