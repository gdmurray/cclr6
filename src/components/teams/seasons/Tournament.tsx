import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import dayjs from 'dayjs'

export default function Tournament({ tournament }): JSX.Element {
    return (
        <div className='bordered border rounded-xl h-52'>
            <div className='flex flex-row w-full p-4 h-full z-10 relative'>
                <div className='flex-1 flex flex-col justify-between'>
                    <div>
                        <div className='text-main font-heavy text-2xl md:text-3xl font-bold'>
                            {tournament.full_name}
                        </div>
                        <div className='mt-1'>
                            <div className='font-semibold text-alt text-sm'>Schedule</div>
                            <div className='flex flex-row items-center text-alt-2 font-medium text-sm'>
                                <FaCalendarAlt />&nbsp;{dayjs(tournament.scheduled_date_start).format('LL')}&nbsp;&nbsp;-&nbsp;&nbsp;{dayjs(tournament.scheduled_date_end).format('LL')}
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div className='flex flex-col justify-between'>
                </div>
            </div>
        </div>
    )
}