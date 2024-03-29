const { fontFamily } = require('tailwindcss/defaultTheme')

const colors = require('tailwindcss/colors')

const extendedColors = {
    primary: '#e50a25',
    success: '#34D399',
    warning: '#FCD34D',
    error: '#F87171',
    twitter: {
        DEFAULT: '#1DA1F2',
        darker: '#00B6F1',
    },
    twitch: {
        DEFAULT: '#9146ff',
        darker: '#6441A4',
    },
}
module.exports = {
    // mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        backgroundColor: (theme) => ({
            ...theme('colors'),
            gray: colors.warmGray,
            ...extendedColors,
            primary: '#e50a25',
            light: '#fff',
            dark: '#131313',
        }),
        gradientColorStops: (theme) => ({
            ...theme('colors'),
            ...extendedColors,
        }),
        fontFamily: {
            sans: ['Inter', ...fontFamily.sans],
            serif: [...fontFamily.serif],
            mono: [...fontFamily.mono],
            heavy: ['Barlow Condensed', ...fontFamily.sans],
        },
        extend: {
            border: ['hover'],
        },
        textColor: (theme) => ({
            ...extendedColors,
            ...theme('colors'),
        }),
        color: {
            ...extendedColors,
            ...colors,
        },
        borderColor: (theme) => ({
            gray: colors.warmGray,
            ...theme,
        }),
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            borderWidth: ['last'],
            outline: ['focus'],
        },
    },
}
