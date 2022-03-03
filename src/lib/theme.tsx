import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'

const config: ThemeConfig = {
    useSystemColorMode: true,
}

const theme = extendTheme({
    config,
    shadows: {
        outline: 'none',
    },
    components: {
        Steps,
    },
})

export default theme
