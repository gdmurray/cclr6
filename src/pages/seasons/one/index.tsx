import SeasonLayout from '@components/season/layout'
import React from 'react'

const SeasonOne = (): JSX.Element => {
    return (
        <div className="max-w-6xl mx-auto text-main">
            <div className="font-heavy text-5xl font-semibold uppercase">
                Welcome to <span className="text-primary">Season One</span>
            </div>
            <p>Welcome to the newest chapter in Canadian Rainbow Six Esports.</p>
        </div>
    )
}

SeasonOne.SEO = {
    url: '/seasons/one',
    title: 'Season One',
    description: 'The inaugural season of Canada Contenders League',
}

SeasonOne.layout = (content: React.ReactNode): JSX.Element => {
    return <SeasonLayout baseUrl={'/seasons/one'}>{content}</SeasonLayout>
}

export default SeasonOne
