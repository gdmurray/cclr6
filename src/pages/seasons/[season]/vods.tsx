import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getSeasonPaths } from '@lib/season/common'
import SeasonLayout from '@components/season/SeasonLayout'
import React from 'react'

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    return {
        props: {},
    }
}

const SeasonVods = (): JSX.Element => {
    return <div>Coming soon</div>
}

SeasonVods.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonVods

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = await getSeasonPaths('vods')
    return {
        paths,
        fallback: true,
    }
}
