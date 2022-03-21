import React from 'react'

const Calendar = (): JSX.Element => {
    return (
        <div className="page-content mb-6">
            <h1 className="page-title mb-6">CCLR6 Dates</h1>
            <div className="container">Calendar goes here</div>
        </div>
    )
}

Calendar.SEO = {
    title: 'Calendar',
    url: '/calendar',
    description: 'A list of upcoming dates for the league',
}

export default Calendar
