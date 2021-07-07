import React from 'react'
import SeasonLayout from '@components/season/layout'

const SeasonOneVods = (): JSX.Element => {
    return <>Coming soon</>
}

SeasonOneVods.SEO = {
    url: '/seasons/one/vods',
    title: 'Season One Vods',
    description: 'Vods for matches played in Season One of Canada Contenders League',
}

SeasonOneVods.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={'/seasons/one'}>{content}</SeasonLayout>
}
export default SeasonOneVods
