const { fontFamily } = require('tailwindcss/defaultTheme')

const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        backgroundColor: theme => ({
            ...theme('colors'),
            gray: colors.warmGray,
            twitter: {
                DEFAULT: '#1DA1F2',
                darker: '#00B6F1'
            },
            twitch: {
                DEFAULT: '#9146ff',
                darker: '#6441A4'
            },
            'primary': '#e50a25',
            'light': '#fff',
            'dark': '#131313'
        }),
        fontFamily: {
            'sans': ['Inter', ...fontFamily.sans],
            'serif': [...fontFamily.serif],
            'mono': [...fontFamily.mono],
            'heavy': ['Barlow Condensed', ...fontFamily.sans]
        },
        extend: {
            border: ['hover']
        },
        textColor: theme => ({
            'primary': '#e50a25',
            ...theme('colors')
        }),
        color: {
            primary: '#e50a25',
            twitter: {
                DEFAULT: '#1DA1F2',
                darker: '#00B6F1'
            },
            twitch: {
                DEFAULT: '#9146ff',
                darker: '#6441A4'
            },
            ...colors
        },
        borderColor: theme => ({
            gray: colors.warmGray,
            ...theme
        })
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            outline: ['focus']
        }
    },
    xwind: {
        mode: 'objectstyles'
    }
}
