import { GetStaticPropsResult } from 'next'
import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'
import { getStaticProps as getTeamsStaticProps } from '@components/season/one/teams'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const { season } = params
    if (season === 'one') {
        return getTeamsStaticProps(params)
    }
    return {
        props: {},
    }
}

const SeasonTeams = (): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-alt-2 font-medium">Teams coming soon</div>
        </div>
    )
}

SeasonTeams.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonTeams

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = getSeasonPaths('teams')
    return {
        paths: paths,
        fallback: true,
    }
}
