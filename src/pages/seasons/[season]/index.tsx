import { GetStaticPropsResult } from 'next'
import { getCurrentSeason, Seasons } from '@lib/season'
import { getSeasonHome } from '@lib/season/api'
import { CMSPost } from '@components/posts/Post'
import React from 'react'
import SeasonLayout from '@components/season/SeasonLayout'

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
            console.log(seo)
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

const SeasonHome = ({ page }): JSX.Element => {
    if (page) {
        return (
            <div>
                <div className="py-4 cms-content" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        )
    }
    return <div>No Content Available</div>
}

SeasonHome.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonHome

export async function getStaticPaths() {
    const paths = Object.values(Seasons).map((season) => season.BASE_URL)
    return {
        paths,
        fallback: true,
    }
}
