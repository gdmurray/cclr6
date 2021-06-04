import { NextApiRequest, NextApiResponse } from 'next'
import authenticate, { isAdmin } from '@lib/api/authenticate'


export default async function register(req: NextApiRequest, res: NextApiResponse) {
    const user = await authenticate(req, res)
    const adminCheck = await isAdmin(user, res)
    if (adminCheck) {

    }

}