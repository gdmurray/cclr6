import { extendTheme, ThemeConfig, ThemeComponents } from '@chakra-ui/react'

const config: ThemeConfig = {
    useSystemColorMode: true
}

// const components: ThemeComponents = {
//     Button: {
//         variants: {
//             focus: {
//                 box
//             }
//         }
//     }
// }

const theme = extendTheme({
    config,
    shadows: {
        outline: 'none'
    }
})

export default theme