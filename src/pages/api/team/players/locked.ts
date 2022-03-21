import { NextApiRequest, NextApiResponse } from 'next'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)
export default async function locked(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const now = dayjs().tz('America/Toronto')
    const close = dayjs('2022-03-21 18:00').tz('America/Toronto')

    if (now.isAfter(close)) {
        res.status(200).json({ status: 'locked', message: `Roster changes locked` })
    } else {
        res.status(200).json({
            status: 'unlocked',
            message: '',
        })
    }
}
