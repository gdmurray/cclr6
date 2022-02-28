import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
// import { GetStaticPathsResult } from 'next'
// import { getSeasonPaths } from '@lib/season/common'

const SeasonSchedule = (): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-alt-2 font-medium">Schedule coming soon</div>
        </div>
    )
}

SeasonSchedule.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonSchedule

// export async function getStaticPaths(): Promise<GetStaticPathsResult> {
//     const paths = getSeasonPaths('teams')
//     return {
//         paths: paths,
//         fallback: true,
//     }
// }
