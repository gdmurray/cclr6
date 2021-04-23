import { getAvailablePositions } from '../../lib/api/getAvailablePositions'

const handler = async (req, res) => {
    const positions = await getAvailablePositions()
    return res.status(200).json({ positions })
}

export default handler