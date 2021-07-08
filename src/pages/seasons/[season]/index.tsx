import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'
import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import { getCurrentSeason, Seasons } from '@lib/season/common'
import { getSeasonHome } from '@lib/season/api'
import { CMSPost } from '@components/posts/Post'

interface SeasonHomeProps {
    page: {
        slug: string
        content: string
    }
}

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<any>> {
    const currentSeason = getCurrentSeason(params)
    const data = await getSeasonHome(params.season)

    function getSEO(data: CMSPost) {
        type SEO = { url: string; title: string; image?: string }
        if (data) {
            const seo: SEO = {
                title: currentSeason.TITLE,
                image: null,
                url: currentSeason.BASE_URL,
            }
            return { SEO: seo }
        }
        return {}
    }

    return {
        props: {
            page: {
                ...data.page,
            },
            ...getSEO(data.page),
        },
        revalidate: 3600,
    }
}

const SeasonHome = ({ page }: SeasonHomeProps) => {
    if (page) {
        return (
            <div>
                <div className="py-4 cms-content" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        )
    }
    return <div>No content available</div>
}

SeasonHome.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonHome

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const paths = Object.values(Seasons).map((season) => season.BASE_URL)
    return {
        paths,
        fallback: true,
    }
}
