import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'
import SeasonLayout from '@components/season/SeasonLayout'
import React from 'react'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    return {
        props: {},
    }
}

const SeasonStats = (): JSX.Element => {
    return <div>Coming soon</div>
}

SeasonStats.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonStats

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = await getSeasonPaths('stats')
    return {
        paths,
        fallback: true,
    }
}
