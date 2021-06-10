import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
    useSystemColorMode: true,
}

const theme = extendTheme({
    config,
    shadows: {
        outline: 'none',
    },
})

export default theme
