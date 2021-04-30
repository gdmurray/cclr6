import React from 'react'
import EmptyState from '@components/EmptyState'
import { FaBook } from 'react-icons/fa'

const Rules = (): JSX.Element => {
    return (
        <div className='page-content'>
            <div className='page-title'>Rulebook</div>
            <div>
                <div className='flex justify-center items-center h-64 flex-col text-alt'>
                    <div>
                        <FaBook style={{ fontSize: '96px' }} />
                    </div>
                    <div className='font-semibold text-lg tracking-tight mt-4'>
                        Rulebook Coming Soon
                    </div>
                </div>
            </div>
        </div>
    )
}

Rules.SEO = {
    url: '/rules',
    title: 'Rulebook'
}

export default Rules