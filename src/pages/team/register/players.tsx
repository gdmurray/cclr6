import React from 'react'
import PlayerRegistration from '../../../components/teams/playerRegistration'

export default function Players(): JSX.Element {

    return (
        <div className='page-content'>
            <div className='page-title-sm'>
                Team Player Registration
            </div>
            <div className='py-12'>
                <PlayerRegistration />
            </div>
        </div>
    )
}