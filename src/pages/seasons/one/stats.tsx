import SeasonLayout from '@components/season/SeasonLayout'
import React from 'react'

const SeasonStats = (): JSX.Element => {
    return <div>Coming soon</div>
}

SeasonStats.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonStats
