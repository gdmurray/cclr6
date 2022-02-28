import SeasonLayout from '@components/season/SeasonLayout'
import React from 'react'

const SeasonVods = (): JSX.Element => {
    return <div>Coming soon</div>
}

SeasonVods.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout>{content}</SeasonLayout>
}

export default SeasonVods
