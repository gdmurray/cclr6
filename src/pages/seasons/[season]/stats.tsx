import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'

const SeasonStats = (): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-alt-2 font-medium">Stats coming soon</div>
        </div>
    )
}

SeasonStats.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonStats

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = getSeasonPaths('stats')
    return {
        paths: paths,
        fallback: true,
    }
}
