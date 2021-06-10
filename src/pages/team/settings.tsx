import React from 'react'
import TeamLayout from '@components/teams/layout'
import NotificationSettings from '@components/teams/settings/NotificationSettings'
import TeamDangerSettings from '@components/teams/settings/TeamDangerSettings'

const TeamSettings = (): JSX.Element => {
    return (
        <div className="max-w-2xl space-y-6">
            <NotificationSettings />
            <TeamDangerSettings />
        </div>
    )
}

TeamSettings.layout = (content: React.ReactNode): JSX.Element => {
    return <TeamLayout>{content}</TeamLayout>
}

export default TeamSettings
