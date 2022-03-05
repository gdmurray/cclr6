import { ClientCredentialsAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'

const clientId = process.env['TWITCH_API_KEY']
const accessToken = process.env['TWITCH_API_SECRET']

const authProvider = new ClientCredentialsAuthProvider(clientId, accessToken)

const apiClient = new ApiClient({ authProvider })

export default apiClient
