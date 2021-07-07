import React from 'react'
import SeasonLayout from '@components/season/layout'

const SeasonOneStats = (): JSX.Element => {
    return <>Coming Soon</>
}

SeasonOneStats.SEO = {
    url: '/seasons/one/stats',
    title: 'Season One Stats',
    description: 'Stats for teams playing in Season One of Canada Contenders League',
}

SeasonOneStats.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={'/seasons/one'}>{content}</SeasonLayout>
}
export default SeasonOneStats
