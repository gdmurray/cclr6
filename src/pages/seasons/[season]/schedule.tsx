import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { getSeasonPaths } from '@lib/season/common'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
// import { useRouter } from 'next/router'
import { getStaticProps as getStaticSeasonProps } from '@components/season/one/schedule'
import { ITeam } from '@lib/models/team'
import { useRouter } from 'next/router'
// import { ITeam } from '@lib/models/team'
// import { GetStaticPathsResult } from 'next'
// import { getSeasonPaths } from '@lib/season/common'

interface SeasonScheduleProps {
    data?: Record<any, any>[]
    teams?: ITeam[]
}

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const { season } = params
    if (season === 'one') {
        return getStaticSeasonProps(params)
    }
    return {
        props: {},
        revalidate: 3600,
    }
}

const SeasonSchedule = ({ data, teams }: SeasonScheduleProps): JSX.Element => {
    // const {
    //     query: { season },
    // } = useRouter()
    // if (season === 'one') {
    //     return <SeasonOneSchedule data={data} teams={teams} />
    // }
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

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = getSeasonPaths('schedule')
    return {
        paths: paths,
        fallback: true,
    }
}
